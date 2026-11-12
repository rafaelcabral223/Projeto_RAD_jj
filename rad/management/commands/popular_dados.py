"""
Popula o banco com os 13 polos atuais (respostas do formulário do Mestre Rad)
e cria o usuário do painel.

    python manage.py popular_dados

Pode rodar mais de uma vez: polos que já existem (mesmo nome) não são duplicados.
"""
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction

from rad.models import Polo, Turma

RAD = "21982121315"


def kids(idade, dias, hora):
    return ("Kids", idade, dias, hora)


def juvenil(dias, hora):
    return ("Juvenil", "11 a 15 anos", dias, hora)


def adultos(dias, hora):
    return ("Adultos", "A partir de 16 anos", dias, hora)


def geral(dias, hora):
    return ("Turma geral", "A partir de 5 anos", dias, hora)


def unica(dias, hora):
    return ("Treino", "Turma única", dias, hora)


POLOS = [
    # nome, estado, endereço, referência, lat, lng, professor, whatsapp, turmas
    ("PPG – Pavão-Pavãozinho", "RJ",
     "R. Saint Roman, 76 (acesso pela Rua Papagaio) – Copacabana, Rio de Janeiro/RJ – CEP 22071-060",
     "Beco da Tintinha, na Segundinha", "-22.9809053", "-43.1939797", "Mestre Rad (Rogério Guedes)", RAD,
     [kids("5 a 10 anos", "Seg · Qua · Sex", "18h"), juvenil("Seg · Qua · Sex", "19h"), adultos("Seg · Qua · Sex", "20h")]),
    ("Rocinha", "RJ", "Quadra da Rua 1 – Rocinha, Rio de Janeiro/RJ – CEP 22451-971",
     "Na quadra da comunidade", "-22.9906911", "-43.2458365", "Fabio Bino", "21997085082",
     [geral("Ter · Qui", "19h")]),
    ("Bola de Neve", "RJ", "R. Assunção, 119 – Botafogo, Rio de Janeiro/RJ – CEP 22251-030",
     "Dentro da Igreja Bola de Neve", "-22.9444742", "-43.1863265", "Mestre Rad (Rogério Guedes)", RAD,
     [geral("Qua", "20h")]),
    ("Ultra Botafogo", "RJ", "R. São Clemente, 159 – Botafogo, Rio de Janeiro/RJ – CEP 22260-003",
     "Na academia", "-22.9504832", "-43.1870939", "Mestre Rad (Rogério Guedes)", RAD,
     [unica("Seg", "9h"), unica("Ter · Qui", "21h"), unica("Qua · Sex", "5h30")]),
    ("Turano", "RJ", "R. Aureliano Portugal, 220 – Rio Comprido, Rio de Janeiro/RJ – CEP 20261-004",
     "Dentro da ONG Fazendo Arte", "-22.9250419", "-43.2142951", "Léo Mendes", "21983268448",
     [geral("Ter · Qui", "18h")]),
    ("Andaraí (Sede)", "RJ", "R. Leopoldo, 71 – Andaraí, Rio de Janeiro/RJ – CEP 20541-170",
     "Dentro da Primeira Igreja Batista do Andaraí", "-22.9259096", "-43.2504032", "Rodrigo Figueiredo", "21964450143",
     [kids("5 a 10 anos", "Seg a Sex", "18h"), juvenil("Seg a Sex", "19h"), adultos("Seg a Sex", "20h")]),
    ("Formiga", "RJ", "R. Camaiore, 23 – Tijuca, Rio de Janeiro/RJ – CEP 20530-170",
     "Quadra da associação de moradores", "-22.9410274", "-43.2437691", "Roney Galvão", "31994987656",
     [kids("5 a 15 anos", "Ter · Qui", "A confirmar"), adultos("Ter · Qui", "20h")]),
    ("Vila Isabel", "RJ", "R. Barão de São Francisco, 295 – Andaraí, Rio de Janeiro/RJ – CEP 20541-371",
     "Na academia", "-22.9189367", "-43.2511106", "Guilherme Mompa", "21994380493",
     [geral("Seg a Sex", "20h")]),
    ("Araruama", "RJ", "Rua E-A, 75 – Residencial Victória, Morro Grande, Araruama/RJ – CEP 28986-468",
     "Dentro do condomínio, perto da padaria Favorita de Paracatu (antigo Casal 20)", "-22.8206549", "-42.3693310",
     "Maximilian Max", "21994614901",
     [kids("5 a 15 anos", "Seg a Qui", "18h"), adultos("Seg a Qui", "20h")]),
    ("Ibirataia", "BA", "R. Bom Jesus, s/n – Ibirataia/BA – CEP 45580-000",
     "Em cima da sorveteria da praça", "-14.0688813", "-39.6385435", "Gilmar de Souza", "73999989587",
     [kids("5 a 15 anos", "Ter · Qua · Qui", "18h"), adultos("Ter · Qua · Qui", "19h30")]),
    ("Nova Ibirataia", "BA", "Rua do Alto, 26 – Nova Ibirataia, Ibirataia/BA – CEP 45580-000",
     "Acima da rodoviária", None, None, "Laerte e Laecyo Souza", "73999698603",
     [geral("Ter · Qui", "19h")]),
    ("Algodão", "BA", "R. José Muniz Ferreira, s/n – Algodão, Ibirataia/BA – CEP 45580-000",
     "Dentro da escola", "-13.9309808", "-39.6244055", "Wellington Gegel", "73999825763",
     [kids("5 a 15 anos", "Ter · Qui", "19h"), adultos("Ter · Qui", "20h")]),
    ("Ipiaú", "BA", "R. Esperança, 46 – Euclides Neto, Ipiaú/BA – CEP 45570-000",
     "", "-14.1262911", "-39.7393288", "Fátima Gonçalves", "73998256236",
     [kids("5 a 15 anos", "Seg · Qua · Sex", "19h"), adultos("Seg · Qua · Sex", "20h")]),
]


class Command(BaseCommand):
    help = "Cadastra os polos atuais da RAD e cria o usuário admin/admin do painel."

    @transaction.atomic
    def handle(self, *args, **options):
        criados = 0
        for ordem, (nome, uf, end, ref, lat, lng, prof, whats, turmas) in enumerate(POLOS, start=1):
            polo, novo = Polo.objects.get_or_create(nome=nome, defaults=dict(
                estado=uf, endereco=end, referencia=ref, latitude=lat, longitude=lng,
                professor=prof, whatsapp=whats, ordem=ordem,
            ))
            if novo:
                criados += 1
                for i, (tnome, idade, dias, hora) in enumerate(turmas, start=1):
                    Turma.objects.create(polo=polo, nome=tnome, faixa_etaria=idade, dias=dias, horario=hora, ordem=i)
        self.stdout.write(self.style.SUCCESS(f"{criados} polos cadastrados ({Polo.objects.count()} no total)."))

        User = get_user_model()
        if not User.objects.filter(username="admin").exists():
            # Senha provisória pedida pela equipe. TROCAR antes de ir para produção.
            User.objects.create_superuser("admin", "", "admin")
            self.stdout.write(self.style.WARNING("Usuário do painel criado: admin / admin (troque a senha!)"))
        else:
            self.stdout.write("Usuário admin já existe.")
