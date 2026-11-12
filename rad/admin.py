import csv

from django.contrib import admin, messages
from django.db.models import Count, Q
from django.http import HttpResponse
from django.utils.html import format_html

from .models import Aluno, AlunoDestaque, Polo, Turma

# Textos do painel
admin.site.site_header = "RAD Jiu Jitsu"
admin.site.site_title = "Painel RAD"
admin.site.index_title = "Painel do Mestre Rad"
admin.site.site_url = "/"


def miniatura(imagem, tamanho=44):
    if not imagem:
        return format_html('<span class="rad-sem-foto">—</span>')
    return format_html(
        '<img src="{}" class="rad-miniatura" style="width:{}px;height:{}px" alt="">',
        imagem.url, tamanho, tamanho,
    )


# ---------------------------------------------------------------- POLOS

class TurmaInline(admin.TabularInline):
    model = Turma
    extra = 0
    fields = ("nome", "faixa_etaria", "dias", "horario", "ordem")


@admin.register(Polo)
class PoloAdmin(admin.ModelAdmin):
    list_display = ("nome", "estado", "professor", "qtd_turmas", "qtd_alunos", "ativo", "ordem")
    list_editable = ("ativo", "ordem")
    list_filter = ("estado", "ativo")
    search_fields = ("nome", "endereco", "professor")
    inlines = [TurmaInline]
    fieldsets = (
        (None, {"fields": ("nome", "estado", "professor", "whatsapp", "ativo", "ordem")}),
        ("Endereço", {"fields": ("endereco", "referencia")}),
        ("Mapa (opcional)", {
            "fields": ("latitude", "longitude"),
            "description": "No Google Maps, clique com o botão direito no local e copie os números (ex.: -22.92, -43.25).",
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(
            _turmas=Count("turmas", distinct=True),
            _alunos=Count("alunos", filter=Q(alunos__ativo=True), distinct=True),
        )

    @admin.display(description="turmas", ordering="_turmas")
    def qtd_turmas(self, obj):
        return obj._turmas

    @admin.display(description="alunos ativos", ordering="_alunos")
    def qtd_alunos(self, obj):
        return obj._alunos


# ---------------------------------------------------------------- ALUNOS

@admin.action(description="Exportar selecionados para planilha (CSV)")
def exportar_csv(modeladmin, request, queryset):
    resposta = HttpResponse(content_type="text/csv; charset=utf-8")
    resposta["Content-Disposition"] = 'attachment; filename="alunos-rad.csv"'
    resposta.write("﻿")  # acentos certos no Excel
    escritor = csv.writer(resposta, delimiter=";")
    escritor.writerow([
        "Nome", "Polo", "Turma", "Faixa", "Graus", "Nascimento", "Idade", "Telefone",
        "Responsável", "Tel. responsável", "Início", "Atestado", "Autoriza imagem", "Ativo",
    ])
    for a in queryset.select_related("polo", "turma"):
        escritor.writerow([
            a.nome, a.polo.nome, a.turma.nome if a.turma else "", a.get_faixa_display(), a.graus,
            a.data_nascimento.strftime("%d/%m/%Y") if a.data_nascimento else "", a.idade or "",
            a.telefone, a.responsavel_nome, a.responsavel_telefone, a.data_inicio.strftime("%d/%m/%Y"),
            "Sim" if a.atestado_medico else "Não", "Sim" if a.autoriza_imagem else "Não",
            "Sim" if a.ativo else "Não",
        ])
    return resposta


@admin.action(description="Marcar como inativos")
def marcar_inativos(modeladmin, request, queryset):
    total = queryset.update(ativo=False)
    messages.success(request, f"{total} aluno(s) marcado(s) como inativo(s).")


class MenorDeIdadeFilter(admin.SimpleListFilter):
    title = "idade"
    parameter_name = "menor"

    def lookups(self, request, model_admin):
        return (("sim", "Menores de 18"), ("nao", "Maiores de 18"))

    def queryset(self, request, queryset):
        from datetime import date
        hoje = date.today()
        try:
            limite = hoje.replace(year=hoje.year - 18)
        except ValueError:  # 29 de fevereiro
            limite = hoje.replace(year=hoje.year - 18, day=28)
        if self.value() == "sim":
            return queryset.filter(data_nascimento__gt=limite)
        if self.value() == "nao":
            return queryset.filter(data_nascimento__lte=limite)
        return queryset


@admin.register(Aluno)
class AlunoAdmin(admin.ModelAdmin):
    list_display = ("foto_mini", "nome", "polo", "turma_curta", "faixa_colorida", "idade_display", "telefone_contato", "ativo")
    list_display_links = ("foto_mini", "nome")
    list_filter = ("polo", "faixa", "ativo", MenorDeIdadeFilter, "autoriza_imagem", "atestado_medico")
    search_fields = ("nome", "responsavel_nome", "telefone", "responsavel_telefone")
    list_select_related = ("polo", "turma")
    list_per_page = 50
    autocomplete_fields = ("polo",)
    actions = [exportar_csv, marcar_inativos]
    fieldsets = (
        ("Aluno", {"fields": ("nome", "data_nascimento", "telefone", "foto", "ativo")}),
        ("Treino", {"fields": ("polo", "turma", ("faixa", "graus"), "data_inicio")}),
        ("Responsável (menores de 18 anos)", {"fields": ("responsavel_nome", "responsavel_telefone")}),
        ("Documentos e autorizações", {"fields": ("estudando", "atestado_medico", "autoriza_imagem")}),
        ("Observações", {"fields": ("observacoes",), "classes": ("collapse",)}),
    )

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "turma":
            kwargs["queryset"] = Turma.objects.select_related("polo").order_by("polo__ordem", "ordem")
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    @admin.display(description="")
    def foto_mini(self, obj):
        return miniatura(obj.foto, 36)

    @admin.display(description="turma", ordering="turma__nome")
    def turma_curta(self, obj):
        if not obj.turma:
            return "—"
        return f"{obj.turma.nome} · {obj.turma.dias} {obj.turma.horario}"

    @admin.display(description="faixa", ordering="faixa")
    def faixa_colorida(self, obj):
        graus = f" · {obj.graus}º" if obj.graus else ""
        return format_html('<span class="rad-faixa rad-faixa-{}">{}{}</span>', obj.faixa, obj.get_faixa_display(), graus)

    @admin.display(description="idade", ordering="-data_nascimento")
    def idade_display(self, obj):
        return f"{obj.idade} anos" if obj.idade is not None else "—"

    @admin.display(description="contato")
    def telefone_contato(self, obj):
        return obj.telefone or obj.responsavel_telefone or "—"


# ---------------------------------------------------------------- ALUNO DESTAQUE

@admin.register(AlunoDestaque)
class AlunoDestaqueAdmin(admin.ModelAdmin):
    list_display = ("foto_mini", "aluno", "polo", "periodo", "publicado", "no_site", "criado_em")
    list_display_links = ("foto_mini", "aluno")
    list_editable = ("publicado",)
    list_filter = ("publicado",)
    autocomplete_fields = ("aluno",)
    readonly_fields = ("previa",)
    fields = ("aluno", "titulo", "periodo", "texto", "foto", "publicado", "previa")

    @admin.display(description="")
    def foto_mini(self, obj):
        return miniatura(obj.foto_site, 36)

    @admin.display(description="polo")
    def polo(self, obj):
        return obj.aluno.polo

    @admin.display(description="está no site?", boolean=True)
    def no_site(self, obj):
        atual = AlunoDestaque.objects.filter(
            publicado=True, aluno__ativo=True, aluno__autoriza_imagem=True,
        ).first()
        return atual is not None and atual.pk == obj.pk

    @admin.display(description="como aparece no site")
    def previa(self, obj):
        if not obj.pk:
            return "Salve para ver a prévia."
        return format_html(
            '<div class="rad-previa">{}<div><strong>{}</strong><span>{} · Faixa {}</span><p>{}</p></div></div>',
            miniatura(obj.foto_site, 96), obj.aluno.nome_publico, obj.aluno.polo,
            obj.aluno.get_faixa_display().lower(), obj.texto,
        )
