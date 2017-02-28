# Instalando servidor Ubuntu para hospedar páginas python + django

Vamos instalar um servidor ubuntu 16.10 para hospedar páginas web desenvolvidas em python com framework django.

Antes de começar, vamos resolver o problema de linguagem da versão 16.10

```bash
apt-get install language-pack-pt
locale-gen pt_BR.UTF-8
reboot
```

Vamos efetuar as atualizações

``` bash
apt-get update
apt-get upgrade
apt-get dist-upgrade
```


## Preparando o servidor

Efetue as configurações de rede para adicionar o endereço de IP do servidor.

Primeiro, vamos preparar o ambiente de rede. Para isso, vamos determinar o endereço de IP no arquivo `/etc/host`

```
127.0.0.1       localhost
127.0.1.1       nome_do_server
192.168.0.40    nome_do_server
```

Agora vamos registrar o dominio de busca para que procure na rede interna, alterando o arquivo `/etc/resolvconf/resolv.conf.d/base`

```
search domain_name.com
```

Agora rode o comando para aplicar as resoluções `resolvconf -u`

Vamos reiniciar os serviços de rede e efetuar os testes

`/etc/init.d/networking restart`

`nslookup nome_do_server`

`nslookup nome_do_server.domain_name.com`

## Primeiro o GIT

Para instalar o git rode o comando `apt-get install git`

Após isso, vamos efetuar a configuração das variáveis globais

```bash
git config --global user.name "TI Grupo Scheffer"
git config --global user.email "ti@gruposcheffer.com.br"
```

Agora vamos adicionar uma chave publica para poder efetuar interação com os projetos

```bash
ssh-keygen -t rsa -C "email@domain"
```

Copie a chave (`cat ~/.ssh/id_rsa.pub`) para configuração de SSH na sua conta no repositório online

## Oracle Client

Para instalar o oracle, baixe os arquivos do oracle.com (instant_client linux_x64_x86 .rpm)

```bash
oracle-instantclient11.2-basic-11.2.0.3.0-1.x86_64.rpm
oracle-instantclient11.2-devel-11.2.0.4.0-1.x86_64.rpm
oracle-instantclient11.2-jdbc-11.2.0.4.0-1.x86_64.rpm
oracle-instantclient11.2-sqlplus-11.2.0.4.0-1.x86_64.rpm
```

Vamos utilizar o `alien` para efetuar a instalação

```bash
apt-get install alien
cd diretorio_dos_arquivos.rpm
alien -i oracle-instantclient11.2-basic-11.2.0.3.0-1.x86_64.rpm
alien -i oracle-instantclient11.2-devel-11.2.0.4.0-1.x86_64.rpm
alien -i oracle-instantclient11.2-jdbc-11.2.0.4.0-1.x86_64.rpm
alien -i oracle-instantclient11.2-sqlplus-11.2.0.4.0-1.x86_64.rpm
```

Agora, vamos editar as variaveis de ambiente para configurar algumas coisas que o client do oracle necessita. `nano ~/.bashrc` e adicione as seguintes linhas no final do arquivo:

```bash
# ORACLE
export ORACLE_HOME=/usr/lib/oracle/11.2/client64/
export LD_LIBRARY_PATH=/usr/lib/oracle/11.2/client64/lib
export PATH=$PATH:$ORACLE_HOME/bin
export TNS_ADMIN=$ORACLE_HOME/network/admin
```

Agora vamos efetuar as configurações com o comando `source ~/.bashrc`

Precisamos criar o diretório para os apelidos de rede (TNS_ADMIN). `mkdir -p $TNS_ADMIN`

E por ultimo, precisamos criar o arquivo de tns (tnsnames.ora). `touch $TNS_ADMIN/tnsnames.ora`

Edite o mesmo e cole os nomes de rede atuais

Antes de rodar o `sqlplus`, precisamos instalar a dependencia do `libaio.so`

```bash
apt-get install libaio1 libaio-dev
```

## JavaScript

Vamos instalar as dependencias para execuções dos javascripts

Primeiro, vamos instalar o node

```bash
apt-get install nodejs npm nodejs-legacy
```

Feito isso, vamos testar instando dois pacotes essênciais.
```bash
npm i -g gulp bower
```

Verificando se esta tudo certo, rode:

```bash
bower -v
gulp -v
```


## Python

Para não termos problemas de versões do sistema operacional, vamos utilizar o pyenv.

Antes de prosseguir a instalação, precisamos instalar as seguintes dependências:

```bash
apt-get install -y make build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev libncursesw5-dev xz-utils
```

Agora vamos efetuar a instalação do pyenv

```bash
apt-get install git python-pip make build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev
sudo pip install virtualenvwrapper

git clone https://github.com/yyuu/pyenv.git ~/.pyenv
git clone https://github.com/yyuu/pyenv-virtualenvwrapper.git ~/.pyenv/plugins/pyenv-virtualenvwrapper

echo '# PYENV' >> ~/.bashrc
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(pyenv init -)"' >> ~/.bashrc
echo 'pyenv virtualenvwrapper' >> ~/.bashrc
```


Atualize o arquivo com o comando `source ~/.bashrc` e vamos efetuar a instalação da versão 3.5.2 do python.

```bash
pyenv install 3.5.2

pyenv versions
* system (set by /root/.pyenv/version)
  3.5.2
```

Para ativar a versão 3.5.2, vamos utilizar o comando `pyenv global 3.5.2`

Para verificar, utilize:

```bash
python -V
Python 3.5.2
```


## VirtualEnv

Vamos instalar as dependencias:

```
apt-get install python-pip python-dev build-essential
apt-get install python3-pip python3-dev
```

Atualizamos o PIP (Vamos utilizar a versão 3 do python)

```
pip3.5 install --upgrade pip
pip3.5 install virtualenv virtualenvwrapper
```

Configuramos o virutalenv no `~/.bashrc` e adicionamos os seguintes itens no final do arquivo

```
# VirtualENV
export WORKON_HOME=~/virtualenvs
```


## Apache

Instalando o apache e configurando o module wsgi

```bash
apt-get install apache2
apt-get install libapache2-mod-wsgi-py3
cd /etc/apache2/mods-enabled/
ln -sf ../mods-available/wsgi.conf
ln -sf ../mods-available/wsgi.load
```

Reinicie o apache `/etc/init.d/apache2 restart`

Vamos configurar o o site do projeto (vou usar de exemplo a cotação web)

Primeiro clonamos o projeto

```bash
cd ~/projects
git clone git@gitlab.com:wGalleti/webCotacao.git
```

Agora que temos o caminho completo do projeto, `/root/projects/webCotacao`, vamos criar o virtualenv e configurar o os direcionamentos.

Criando o virtualenv

```bash
python -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
cp env_example .env
python manage.py test
```

Se tudo tiver ok, seu projeto está pronto.

Agora vamos configurar o apache para servir essa pasta.

```bash
nano /etc/apache2/sites-enabled/000-default.conf
```

Vamos deixar o arquivo da seguinte maneira, para servir os arquivos da api (na porta 8000)

```
<VirtualHost *:8000>
        Alias /static /root/projects/webCotacao/static
        <Directory /root/projects/webCotacao/static >
            Require all granted
        </Directory>

        <Directory /root/projects/webCotacao/cotacao >
            <Files wsgi.py>
                Require all granted
            </Files>
        </Directory>

        WSGIDaemonProcess cotacaoweb python-home=/root/projects/webCotacao/.venv python-path=/root/projects/webCotacao
        WSGIPassAuthorization On
        WSGIProcessGroup cotacaoweb
        WSGIScriptAlias / /root/projects/webCotacao/cotacao/wsgi.py

        ErrorLog ${APACHE_LOG_DIR}/error_api.log
        CustomLog ${APACHE_LOG_DIR}/access_api.log combined

</VirtualHost>
```

E para servir os arquivos stativos (frontend), ficara da seguinte maneira (na porta 80)

```
<VirtualHost *:80>
        DocumentRoot /root/projects/webCotacao/frontend/dist

        <Directory /root/projects/webCotacao/frontend/dist>
            Options +Indexes
            DirectoryIndex index.html
            Require all granted
        </Directory>

        ErrorLog ${APACHE_LOG_DIR}/error_site.log
        CustomLog ${APACHE_LOG_DIR}/access_site.log combined

</VirtualHost>
```

Agora precisamos ativar a porta 8000 no apache.

Para isso, adicione abaixo do comando `Listen 80` o comando `Listen 8000` e reinicie o apache `/etc/init.d/apache2 restart`

Walahhh. Site funcionando
