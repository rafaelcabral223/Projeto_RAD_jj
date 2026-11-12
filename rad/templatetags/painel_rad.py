from django import template
from django.db.models import Count, Q

from rad.models import Aluno, AlunoDestaque, Polo

register = template.Library()


@register.inclusion_tag("admin/rad/resumo.html")
def painel_resumo():
    """Cartões do início do painel: números, alunos por polo e aluno destaque."""
    ativos = Aluno.objects.filter(ativo=True)
    polos = (
        Polo.objects.filter(ativo=True)
        .annotate(total=Count("alunos", filter=Q(alunos__ativo=True)))
        .order_by("-total", "ordem")
    )
    maior = max([p.total for p in polos], default=0) or 1
    for p in polos:
        p.percentual = round(p.total * 100 / maior)
    return {
        "total_alunos": ativos.count(),
        "total_polos": polos.count(),
        "total_faixas_pretas": ativos.filter(faixa=Aluno.Faixa.PRETA).count(),
        "sem_atestado": ativos.filter(atestado_medico=False).count(),
        "polos": polos,
        "destaque": AlunoDestaque.objects.filter(
            publicado=True, aluno__ativo=True, aluno__autoriza_imagem=True,
        ).select_related("aluno", "aluno__polo").first(),
        "ultimos": ativos.select_related("polo").order_by("-criado_em")[:5],
    }
