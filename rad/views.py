from django.shortcuts import render

from .models import AlunoDestaque, Polo


def inicio(request):
    """Landing page. Polos e aluno destaque vêm do banco (cadastrados pelo painel)."""
    polos = Polo.objects.filter(ativo=True).prefetch_related("turmas")
    destaque = (
        AlunoDestaque.objects.filter(publicado=True, aluno__ativo=True, aluno__autoriza_imagem=True)
        .select_related("aluno", "aluno__polo")
        .first()
    )
    return render(request, "rad/index.html", {
        "polos": polos,
        "polos_site": [polo.para_site() for polo in polos],
        "destaque": destaque,
    })
