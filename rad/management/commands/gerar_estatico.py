"""
Gera a landing page como site estático (HTML + CSS + JS + imagens) na pasta dist/.

Usado pelo Netlify, que só serve arquivos prontos e não roda Django.
O painel (/admin) e as fotos enviadas por ele só existem no servidor Django
(PythonAnywhere).

    python manage.py gerar_estatico
"""
import shutil
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand
from django.test import RequestFactory

from rad.views import inicio


class Command(BaseCommand):
    help = "Gera a landing estática em dist/ (para o Netlify)."

    def add_arguments(self, parser):
        parser.add_argument("--saida", default="dist")

    def handle(self, *args, saida, **options):
        destino = Path(saida)
        if destino.exists():
            shutil.rmtree(destino)
        destino.mkdir(parents=True)

        resposta = inicio(RequestFactory().get("/"))
        (destino / "index.html").write_bytes(resposta.content)

        origem = Path(__file__).resolve().parents[2] / "static" / "rad"
        shutil.copytree(origem, destino / settings.STATIC_URL.strip("/") / "rad")

        self.stdout.write(self.style.SUCCESS(f"Landing estática gerada em {destino}/"))
