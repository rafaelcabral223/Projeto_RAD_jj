from datetime import date

from django.core.exceptions import ValidationError
from django.core.management import call_command
from django.test import TestCase

from .models import Aluno, AlunoDestaque, Polo


class RadTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("popular_dados", verbosity=0)
        cls.ppg = Polo.objects.get(nome__startswith="PPG")
        cls.rocinha = Polo.objects.get(nome="Rocinha")

    def aluno(self, **dados):
        base = dict(nome="João Pedro Silva", polo=self.ppg, data_nascimento=date(1990, 1, 1))
        base.update(dados)
        return Aluno(**base)

    def test_popular_dados_cria_13_polos_e_admin(self):
        self.assertEqual(Polo.objects.count(), 13)
        self.assertTrue(self.client.login(username="admin", password="admin"))

    def test_turma_de_outro_polo_e_recusada(self):
        aluno = self.aluno(turma=self.rocinha.turmas.first())
        with self.assertRaises(ValidationError):
            aluno.full_clean()

    def test_menor_precisa_de_responsavel(self):
        with self.assertRaises(ValidationError):
            self.aluno(data_nascimento=date.today().replace(year=date.today().year - 10)).full_clean()

    def test_nome_publico_protege_sobrenome(self):
        self.assertEqual(self.aluno().nome_publico, "João S.")

    def test_destaque_exige_autorizacao_de_imagem(self):
        aluno = self.aluno(autoriza_imagem=False)
        aluno.save()
        with self.assertRaises(ValidationError):
            AlunoDestaque(aluno=aluno, texto="Dedicado").full_clean()

    def test_landing_mostra_polos_e_destaque_sem_dados_internos(self):
        aluno = self.aluno(autoriza_imagem=True, telefone="21911112222")
        aluno.save()
        AlunoDestaque.objects.create(aluno=aluno, texto="Campeão estadual")
        html = self.client.get("/").content.decode()
        self.assertIn("polos-dados", html)
        self.assertIn("João S.", html)
        self.assertNotIn("João Pedro Silva", html)   # nome completo não vai para o site
        self.assertNotIn("21911112222", html)        # telefone do aluno também não

    def test_sem_destaque_a_secao_some(self):
        self.assertNotIn('id="destaque"', self.client.get("/").content.decode())

    def test_painel_abre(self):
        self.client.login(username="admin", password="admin")
        for url in ["/admin/", "/admin/rad/aluno/", "/admin/rad/aluno/add/",
                    "/admin/rad/polo/", "/admin/rad/alunodestaque/add/"]:
            self.assertEqual(self.client.get(url).status_code, 200, url)
