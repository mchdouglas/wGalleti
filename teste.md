# **Grupo Scheffer** 
## Atualização de Sistemas 
### Módulos
* Sapiens
 * Vetorh
 * Senior Documentos Eletrônicos

## Atualizando Sapiens e Vetorh

### 1º Remover os grupos de usuários dos servidores de acesso 

Isso evita que algum usuário possa tentar acessar o sistema

### 2º Efetuar backup do banco de dados

Backup feito pela equipe responsável pela empresa terceirizada. Abrir um chamado com antecedendia enviando um email para chamados@dbitsolutions.com.br com o seguinte assunto

> Favor efetuar backup dos schemas Sapiens, Vetorh, DB_Integracao, Gatec_Saf e Gatec_Mec para efetuamos o procedimento de atualização.

### 3º Efetuar backup dos arquivos do sistema

#### Sapiens / Vetorh

No diretório de instalação (E:\\SeniorProducao\\) fazer o backup das pastas `Sapiens` e `Vetorh` 

#### GAtec

No diretório de instalação (E:\\GatecProducao\\) fazer o backup da pasta `bin`

#### Glassfish

No diretório de instalação (C:\\glassfish3\\glassfish\\domains\\) fazer o backup da pasta `dnSenior`

### 4º Limpar dados do GlassFish

Acessar o serviço de administração do [glassfish](https://jacare:4848) na opção de applications selecionar todos os serviços e fazer o disable. Após isso realizar o undeploy.

Reiniciar o serviço do Glassfish

### 5º Desinstalar os seriços e ferramentas web service

1. Acessar o diretório de instação do sistema executar o SeniorInstaller
2. Na opção `Selecione os Produtos que Serão Alterados` desmarcar as opções Ferramentas e Forma de Acessos
3. Prosseguir com a desisntalação

### 6º Consistencia de Base
    
Acessar o CBDS dos sistemas sapiens e vetorh e realizar a consistencia de base

### 7º Iniciar Atualização

Acessar o diretório de instação do sistema executar SeniorUpdater e seguir com atualização da versão

### 8º Instalar os seriços e ferramentas web service

1. Acessar o diretório de instação do sistema executar o SeniorInstaller
2. Na opção `Selecione os Produtos que Serão Alterados` marcar todas as opções exceto `Integrador G7` pois não utilizamos essa ferrameta

### 9º Reiniciar os Serviços

Acessar o gerenciador de serviços no servidor e reiniciar os serviços Glassfish, Middlware e Serviço de informações da instalação

### Processo Finalizado

Acessar os servidores de acesso e abrir as aplicações `Sapiens (Gestão Empresarial)` e `Administração Pessoal (Rubi)`

## Atualizando Senior Documentos Eletrônicos

### 1º Acessar o aplicativo de instação

1. Executar o eDocs_Servidor 
2. Em `Identificação da Instalação` selecionar a base para atualziação
3. Seguir com a instalação

### 2º Iniciar os serviços

Apos concluir a atualização iniciar os serviços Senior Documentos Eletrônicos, Print Service e Web Site

## Vide de Demonstração

<video controls="controls">
  <source type="video/mp4" src="https://web.gruposcheffer.com/video/video_atualizacao.mp4"></source>
  <p>Your browser does not support the video element.</p>
</video>
