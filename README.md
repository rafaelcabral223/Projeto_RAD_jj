# RAD Jiu Jitsu – Site + Painel

Landing page da RAD Jiu Jitsu (Mobile First!) com banco de dados em Django.
Pelo painel (`/admin`), o Mestre Rad cadastra **alunos**, edita **polos e horários**
e escolhe o **aluno destaque** que aparece no site.

## O que tem aqui

```
rad/                  ← o app (é isso que vai para o projeto Django da equipe)
├── models.py         Polo, Turma, Aluno, AlunoDestaque
├── admin.py          Painel: listas, filtros, exportar CSV, prévia do destaque
├── views.py          Landing page lendo polos e destaque do banco
├── urls.py
├── tests.py          8 testes (python manage.py test rad)
├── management/commands/popular_dados.py   13 polos atuais + usuário admin/admin
├── templates/
│   ├── rad/index.html        landing page
│   └── admin/                tema do painel (login, início com resumo)
└── static/rad/       css, js e imagens da landing + painel.css
rad_site/             projeto mínimo, só para rodar e testar o app sozinho
```

## Rodar localmente

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py popular_dados      # 13 polos + login admin / admin
python manage.py runserver
```

- Site: http://127.0.0.1:8000/
- Painel: http://127.0.0.1:8000/admin/ (usuário **admin**, senha **admin**)

## Levar o app para o projeto Django existente

1. Copie a pasta `rad/` para o projeto.
2. Em `settings.py`:
   ```python
   INSTALLED_APPS = [
       "rad",                    # ANTES do django.contrib.admin (para o tema do painel)
       "django.contrib.admin",
       ...
   ]
   LANGUAGE_CODE = "pt-br"
   TIME_ZONE = "America/Sao_Paulo"
   MEDIA_URL = "media/"
   MEDIA_ROOT = BASE_DIR / "media"   # fotos enviadas pelo painel
   ```
3. Em `urls.py`: `path("", include("rad.urls"))`.
4. `pip install Pillow` (fotos), depois `migrate` e `popular_dados`.

Se o projeto já tiver modelos de polo/aluno, dá para aproveitar só partes
(o tema do painel e a seção de destaque são independentes).

## Modelos

| Modelo | Para quê | Aparece no site? |
|---|---|---|
| **Polo** | Endereço, ponto de referência, professor, WhatsApp, coordenadas do mapa, ordem, ativo | Sim (seção Polos) |
| **Turma** | Horários de cada polo (nome, faixa etária, dias, horário). Editada dentro do polo | Sim |
| **Aluno** | Cadastro interno: nascimento, polo/turma, faixa e graus, responsável, atestado, autorização de imagem, foto | **Não** |
| **AlunoDestaque** | Aluno escolhido + texto + período + foto. O mais recente publicado vai para o site | Sim, só nome e inicial do sobrenome ("João S.") |

Regras que o banco garante:
- Turma tem que ser do mesmo polo do aluno.
- Menor de 18 anos precisa de responsável.
- Só alunos **ativos com autorização de imagem** podem ser destaque.
- Sem destaque publicado, a seção some do site.

## Painel

- Início com resumo: alunos ativos, polos, faixas-pretas, alunos sem atestado,
  gráfico de alunos por polo, destaque atual e últimos cadastros.
- Alunos: busca por nome/responsável/telefone, filtros (polo, faixa, menores de 18,
  atestado, autorização), ação **Exportar para planilha (CSV)**.
- Polos: turmas editadas na mesma tela; "aparece no site" e ordem editáveis na lista.
- Aluno destaque: escolha com busca e prévia de como fica no site.

## Antes de ir para produção (PythonAnywhere)

- **Trocar a senha do admin** (Painel → Alterar senha) ou criar outro usuário.
- Definir as variáveis `DJANGO_SECRET_KEY` (nova, secreta) e `DJANGO_DEBUG=0`.
- `python manage.py collectstatic` e, na aba **Web**, mapear:
  - `/static/` → pasta `staticfiles/`
  - `/media/` → pasta `media/`
- `db.sqlite3` e `media/` estão no `.gitignore`: dados dos alunos não vão para o GitHub.
