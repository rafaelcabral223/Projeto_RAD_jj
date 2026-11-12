from datetime import date
from urllib.parse import quote

from django.core.exceptions import ValidationError
from django.db import models


class Polo(models.Model):
    """Local onde a RAD dá aula. Aparece no site (seção Polos)."""

    class Estado(models.TextChoices):
        RJ = "RJ", "Rio de Janeiro"
        BA = "BA", "Bahia"

    nome = models.CharField(max_length=100)
    estado = models.CharField(max_length=2, choices=Estado.choices, default=Estado.RJ)
    endereco = models.CharField(
        "endereço completo", max_length=255,
        help_text="Rua, número, bairro, cidade/UF e CEP. Aparece no site.",
    )
    referencia = models.CharField(
        "ponto de referência", max_length=255, blank=True,
        help_text='Ex.: "Dentro da igreja", "Em cima da sorveteria da praça".',
    )
    latitude = models.DecimalField(
        max_digits=10, decimal_places=7, null=True, blank=True,
        help_text="Opcional. Deixa o pin do mapa no lugar exato. Sem isso, o mapa busca pelo endereço.",
    )
    longitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    professor = models.CharField("professor responsável", max_length=150)
    whatsapp = models.CharField(
        "WhatsApp do polo", max_length=20,
        help_text="Só números, com DDD. Ex.: 21982121315",
    )
    ordem = models.PositiveIntegerField(default=0, help_text="Ordem em que o polo aparece no site.")
    ativo = models.BooleanField("aparece no site", default=True)

    class Meta:
        ordering = ["ordem", "nome"]

    def __str__(self):
        return self.nome

    def clean(self):
        self.whatsapp = "".join(c for c in self.whatsapp if c.isdigit())
        if len(self.whatsapp) not in (10, 11, 12, 13):
            raise ValidationError({"whatsapp": "Digite o número com DDD. Ex.: 21982121315"})

    @property
    def whatsapp_completo(self):
        """Número no formato do wa.me (com 55 na frente)."""
        return self.whatsapp if self.whatsapp.startswith("55") and len(self.whatsapp) > 11 else "55" + self.whatsapp

    @property
    def local_mapa(self):
        if self.latitude is not None and self.longitude is not None:
            return f"{self.latitude},{self.longitude}"
        return self.endereco

    @property
    def link_como_chegar(self):
        return "https://www.google.com/maps/dir/?api=1&destination=" + quote(self.local_mapa)

    def para_site(self):
        """Dados públicos do polo, no formato que o js/script.js usa."""
        return {
            "nome": self.nome,
            "endereco": self.endereco,
            "referencia": self.referencia,
            "mapa": f"{self.latitude},{self.longitude}" if self.latitude is not None and self.longitude is not None else "",
            "professor": self.professor,
            "whatsapp": self.whatsapp_completo,
            "turmas": [t.para_site() for t in self.turmas.all()],
        }


class Turma(models.Model):
    """Horário de aula de um polo. Ex.: Kids · 5 a 10 anos · Seg · Qua · 18h."""

    polo = models.ForeignKey(Polo, on_delete=models.CASCADE, related_name="turmas")
    nome = models.CharField(max_length=50, help_text="Ex.: Kids, Juvenil, Adultos, Turma geral.")
    faixa_etaria = models.CharField(
        "faixa etária", max_length=50, help_text='Ex.: "5 a 10 anos", "A partir de 16 anos".',
    )
    dias = models.CharField(max_length=50, help_text='Ex.: "Seg · Qua · Sex", "Seg a Sex".')
    horario = models.CharField("horário", max_length=30, help_text='Ex.: "18h", "19h30".')
    ordem = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["ordem", "id"]

    def __str__(self):
        return f"{self.polo} · {self.nome} · {self.dias} {self.horario}"

    def para_site(self):
        return {"nome": self.nome, "idade": self.faixa_etaria, "dias": self.dias, "horario": self.horario}


class Aluno(models.Model):
    """Cadastro interno de alunos. NÃO aparece no site (só o aluno destaque, se escolhido)."""

    class Faixa(models.TextChoices):
        BRANCA = "branca", "Branca"
        CINZA = "cinza", "Cinza"
        AMARELA = "amarela", "Amarela"
        LARANJA = "laranja", "Laranja"
        VERDE = "verde", "Verde"
        AZUL = "azul", "Azul"
        ROXA = "roxa", "Roxa"
        MARROM = "marrom", "Marrom"
        PRETA = "preta", "Preta"

    nome = models.CharField("nome completo", max_length=150)
    data_nascimento = models.DateField("data de nascimento", null=True, blank=True)
    polo = models.ForeignKey(Polo, on_delete=models.PROTECT, related_name="alunos")
    turma = models.ForeignKey(
        Turma, on_delete=models.SET_NULL, null=True, blank=True, related_name="alunos",
        help_text="Escolha uma turma do mesmo polo.",
    )
    faixa = models.CharField(max_length=10, choices=Faixa.choices, default=Faixa.BRANCA)
    graus = models.PositiveSmallIntegerField(default=0)
    telefone = models.CharField("telefone / WhatsApp", max_length=20, blank=True)
    responsavel_nome = models.CharField(
        "nome do responsável", max_length=150, blank=True, help_text="Obrigatório para menores de 18 anos.",
    )
    responsavel_telefone = models.CharField("telefone do responsável", max_length=20, blank=True)
    data_inicio = models.DateField("começou a treinar em", default=date.today)
    atestado_medico = models.BooleanField("entregou atestado médico", default=False)
    estudando = models.BooleanField("está estudando", default=True)
    autoriza_imagem = models.BooleanField(
        "autoriza uso de imagem", default=False,
        help_text="Só alunos com autorização podem ser escolhidos como aluno destaque.",
    )
    foto = models.ImageField(upload_to="alunos/", blank=True)
    observacoes = models.TextField("observações", blank=True)
    ativo = models.BooleanField(default=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["nome"]

    def __str__(self):
        return f"{self.nome} ({self.polo})"

    @property
    def idade(self):
        if not self.data_nascimento:
            return None
        hoje = date.today()
        n = self.data_nascimento
        return hoje.year - n.year - ((hoje.month, hoje.day) < (n.month, n.day))

    @property
    def nome_publico(self):
        """Primeiro nome + inicial do sobrenome. Ex.: "João S." (protege menores no site)."""
        partes = self.nome.split()
        if len(partes) == 1:
            return partes[0]
        return f"{partes[0]} {partes[-1][0]}."

    def clean(self):
        erros = {}
        if self.turma_id and self.polo_id and self.turma.polo_id != self.polo_id:
            erros["turma"] = "Essa turma é de outro polo."
        if self.idade is not None and self.idade < 18 and not self.responsavel_nome:
            erros["responsavel_nome"] = "Aluno menor de idade: informe o responsável."
        if erros:
            raise ValidationError(erros)


class AlunoDestaque(models.Model):
    """Aluno destaque que aparece no site. O mais recente publicado é o que aparece."""

    aluno = models.ForeignKey(
        Aluno, on_delete=models.CASCADE, related_name="destaques",
        limit_choices_to={"ativo": True, "autoriza_imagem": True},
        help_text="Só aparecem alunos ativos com autorização de uso de imagem.",
    )
    titulo = models.CharField("título", max_length=80, default="Aluno destaque do mês")
    periodo = models.CharField(
        "período", max_length=40, blank=True, help_text='Ex.: "Novembro de 2026".',
    )
    texto = models.TextField(
        "por que ele é destaque?", help_text="Conquistas, dedicação, evolução. Aparece no site.",
    )
    foto = models.ImageField(
        upload_to="destaques/", blank=True,
        help_text="Opcional. Se vazio, usa a foto do cadastro do aluno.",
    )
    publicado = models.BooleanField("aparece no site", default=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "aluno destaque"
        verbose_name_plural = "alunos destaque"
        ordering = ["-criado_em"]

    def __str__(self):
        return f"{self.aluno.nome} · {self.periodo}" if self.periodo else self.aluno.nome

    def clean(self):
        if self.aluno_id and not self.aluno.autoriza_imagem:
            raise ValidationError({"aluno": "Esse aluno não tem autorização de uso de imagem."})

    @property
    def foto_site(self):
        return self.foto or self.aluno.foto
