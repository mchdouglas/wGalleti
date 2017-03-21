# Criando Projeto django e enviando para o HEROKU

## Preparação do ambiente

* Crie o diretorio para o projeto e entre no mesmo `mkdir %nomeprojeto & cd $_`
* Criar o ambiente virtual `python -m venv .venv`
* Ativar ambiente `source .venv/bin/activate`
* Atualizar pip `pip install --upgrade pip`
* Instalar dependencias `pip install django django-cors-headers django-extensions django-filter django-jet django-rest-auth djangorestframework dj-database-url dj-static python-decouple gunicorn psycopg2`

### Detalhando as dependências
* **django**: Framework para desenvolvimento web
* **django-cors-headers**: Módulo para permitir acesso via cors (cross domain origin)
* **django-extensions**: *dev*. Ativa extenções para desenvolvedor
* **django-filter**: Módulo para utilizar filtros no django
* **django-jet**: Template para o admin
* **django-rest-auth**: Módulo para autenticação via REST
* **djangorestframework**: Módulo para desenvolver apis REST
* **dj-database-url**: Módulo para converter string de conexão em url
* **dj-static**: Módulo para servir arquivos staticos
* **python-decouple**: Módulo que ajuda na parte de seguraça da aplicação (utilizar parametros via arquivo .env)
* **gunicorn**: Servidor web
* **psycopg2**: Módulo de acesso ao postgres

## Inicando o projeto

Após o ambiente preparado, vamos iniciar o projeto.  
Primeiro, vamos salvar os módulos que nosso projeto necessita:  
`pip freeze > requirements.txt`

Após isso, vamos criar nosso projeto:  
`django-admin startproject %nomeprojeto .`

├── %nomeprojeto
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── manage.py
└── requirements.txt

Agora iremos efetuar algumas configurações:

Primeiro, vamos ao arquivo `settings.py`. Nele, iremos informar as chaves do projeto, conexão de banco de dados, caminhos, etc.

Para aumentar a segurança, e remover desse arquivo dados de senha e chave, vamos utilizar o decouple. Para isso vamos criar o arquivo `.env`

Nele vamos informar os seguintes itens:

```
SECRET_KEY=***********************************(Copiar do seu settings.py)
DEBUG=True
```

Agora dentro do nosso `setting.py`, vamos efetuar os imports do decouple e dj-database-url, logo após o `import os`:

```python
from decouple import config
from dj_database_url import parse as dburl
```

Agora vamos configurar nosso `SECRET_KEY` e `DEBUG` para buscar as informações do arquivo `.env`

```python
# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = DEBUG = config('DEBUG', default=False, cast=bool)
```

Em desenvolvimento, vamos usar o `sqlite`, então para configurá-lo, vamos criar uma variável, passando o valor padrão para caso não houver informações de conexão no arquivo `.env`

```python
# Database
# https://docs.djangoproject.com/en/1.10/ref/settings/#databases
default_db_url = 'sqlite:///' + os.path.join(BASE_DIR, 'db.sqlite3')
```

A nossa string de conexão, irá ficar dessa forma:

```python
DATABASES = {
    'default': config('DATABASE_URL', default=default_db_url, cast=dburl)
}
```

Agora vamos efetuar algumas outras configurações importantes como hosts permitidos para acessar, linguagem, timezone, local dos arquivos staticos e etc.

```python
# hosts
ALLOWED_HOSTS = [
    '*'
]
# tradução
LANGUAGE_CODE = 'pt-br'
# timestamp
TIME_ZONE = 'America/Cuiaba'
# desativa timezone
USE_TZ = False
# diretorio de arquivos staticos
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
```

Pronto, tudo configurado, agora vamos implementar o template JET para ficar mais agradavel o visual do admin:

Primeiro, dentro de `INSTALLED_APPS`, vamos registrá-lo.

```python
INSTALLED_APPS = [
    'jet.dashboard',
    'jet',
    ...
```

Agora, vamos informar algumas configurações do JET

```python
# tema
JET_DEFAULT_THEME = 'light-gray'
# menu compacto
JET_SIDE_MENU_COMPACT = True
# dashboard index
JET_INDEX_DASHBOARD = 'jet.dashboard.dashboard.DefaultIndexDashboard'
# app index dashboard
JET_APP_INDEX_DASHBOARD = 'jet.dashboard.dashboard.DefaultAppIndexDashboard'
```

Agora vamos configurar o `djangorestframework`:

Adicionando o `'rest_framework'`, `'rest_framework.authtoken'`, `'rest_auth'` ao **INSTALLED_APPS**, e criamos o a seguinte variavel:

```python
# Rest Framework

REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': ('django_filters.rest_framework.DjangoFilterBackend',),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
    )
}
```

Agora vamos configurar o `cors-headers`:

Adicionando o `'corsheaders'` ao **INSTALLED_APPS**, e criamos o a seguinte variavel:

```python
# Cors Headers
CORS_ORIGIN_ALLOW_ALL = True
```

Em `MIDDLEWARE`, antes de `'django.middleware.common.CommonMiddleware'`, adicione `'corsheaders.middleware.CorsMiddleware',`


Por ultimo, vamos informar as configurações de email:

```python
# Email
EMAIL_HOST = 'smtp.gruposcheffer.com.br'
EMAIL_HOST_USER = 'email@gruposcheffer.com.br'
EMAIL_HOST_PASSWORD = 'senha'
EMAIL_PORT = 587
EMAIL_USE_TLS = False
```

Agora, precisamos configurar algumas urls para o `JET` funcionar. Para isso, abra o arquivo `urls.py`:

```python
from django.conf.urls import url, include
from django.contrib import admin

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    # jet
    url(r'^jet/', include('jet.urls', 'jet')),
    url(r'^jet/dashboard/', include('jet.dashboard.urls', 'jet-dashboard')),
]
```

Se tudo estiver correto, podemos rodar as migrações e iniciar nosso projeto:

```bash
(.venv)atividades $ python manage.py migrate
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, dashboard, jet, sessions
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  Applying admin.0001_initial... OK
  Applying admin.0002_logentry_remove_auto_add... OK
  Applying contenttypes.0002_remove_content_type_name... OK
  Applying auth.0002_alter_permission_name_max_length... OK
  Applying auth.0003_alter_user_email_max_length... OK
  Applying auth.0004_alter_user_username_opts... OK
  Applying auth.0005_alter_user_last_login_null... OK
  Applying auth.0006_require_contenttypes_0002... OK
  Applying auth.0007_alter_validators_add_error_messages... OK
  Applying auth.0008_alter_user_username_max_length... OK
  Applying dashboard.0001_initial... OK
  Applying jet.0001_initial... OK
  Applying jet.0002_delete_userdashboardmodule... OK
  Applying sessions.0001_initial... OK


(.venv)atividades $ python manage.py runserver
Performing system checks...

System check identified no issues (0 silenced).
February 09, 2017 - 00:50:28
Django version 1.10.5, using settings 'atividades.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

Após isso, precisamos criar um usuario padrão, para podemos acessar nossa administração. Para isso, iremos utilizar o comando `createsuperuser`:

```bash
(.venv)atividades $ python manage.py createsuperuser
Username (leave blank to use 'wgalleti'): admin
Email address: ti@gruposcheffer.com.br
Password: 
Password (again): 
Superuser created successfully.
```

Feito isso, vamos adicionar algumas estruturas do HEROKU (aws):

Para isso, vamos precisar criar o app no heroku, criar os arquivos Procfile, runtime.txt.

Primeiro, precisamos informar quem vai servir os arquivos staticos no heroku, por isso utilizamos o módulo `dj-static`. Para isso, abra o arquivo `wsgi.py`:

```python
import os
from dj_static import Cling

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "atividades.settings")

application = Cling(get_wsgi_application())
```

Agora, vamos criar o arquivo `Procfile`, que informa ao heroku como que as coisas vão acontecer:

```
web: gunicorn %nomeprojeto.wsgi --log-file -
```

Agora, camos criar o arquivo `runtime.txt`, que informa qual versão do python vamos utilizar:

```
python-3.5.2
```

Feito isso, vamos preparar o git.

Primeiro, iniciamos o repositório com o comando `git init` e depois vamos criar o arquivo `.gitignore`, para não enviarmos alguns arquivos.

```git
.DS_Store
.env
.idea
.venv
*.sqlite3
*pyc
__pycache__
```

Feito isso, vamos comitar os arquivos. Primeiro enviamos o .gitignore

```git
git add .gitignore
git commit -m "Add ignore config"
```

Agora vamos enviar os arquivos de configuração do heroku

```git
git add Procfile runtime.txt
git commit -m "Heroku config"
```

Agora, vamos importar o restante dos arquivos

```
git add .
git commit -m "Import project"
```

Agora, vamos ao Heroku.

Nessa etapa, precisamos criar o app, configurar as variaveis, e enviar os arquivos.

Antes de começar, instale o heroku client para utilizar os comandos.

Vamos criar e configurar o app:

```bash
heroku create %nomeprojeto
heroku config:set SECRET_KEY='CHAVE QUE ESTA NO .env'
heroku config:set DEBUG=False
```

Feito isso, vamos enviar o projeto

```
git push heroku master
```

Pronto, projeto no ar!!!

Para finalizar, precisamos informar a conexão do banco de dados. Para isso, crie a variavel `DATABASE_URL` e defina o valor que esta no site, pois o heroku criou um novo datastore para essa aplicação.

```bash
heroku config:set DATABASE_URL=postgres://...
```

Após isso, vamos rodar as migrações e criar o usuario admin:

```
heroku run python manage.py migrate
heroku run python manage.py createsuperuser
```
