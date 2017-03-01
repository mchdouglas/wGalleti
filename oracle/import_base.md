# Enviando dados da produção para homologação - Via datapump

## Preparando ambiente

Primeiramente, precisamos acessar o servidor de aplicação Oracle para iniciarmos os trabalhos. Para isso, precisamos de uma ferramenta de ssh (Ambiente de produção é UNIX).

Para logar, vamos usar o comando

```bash
ssh root@oracle.gruposcheffer.com
```

Após informar usuário e senha, vamos trocar o usuário, para o usuário `oracle`

```bash
bash
su - oracle
bash
```

***MUITA ATENÇÃO!!! Essas configurações poderão determinar o sucesso ou um enorme PROBLEMA, pois nesse ambiente, está os bancos de produção.***

Após logar com o usuario `oracle`, vamos verificar qual instância está disponivel.

```bash
echo $ORACLE_SID
```

Essa variável, determina o nome do ambiente que recebera os comandos. Nesse exemplo, vamos utilizar a instância `HM1`, homologação

```bash
export ORACLE_SID=HM1
```

Para confirmar a instancia, podemos rodar a seguinte consulta

```bash
sqlplus / as sysdba
SQL> SELECT STATUS, INSTANCE_NAME FROM V$INSTANCE;

STATUS       INSTANCE_NAME
------------ ----------------
OPEN         HM1
```

Conferido os ambientes, vamos aos proximos passos.

## Eliminando usuários (schemas)

Para importamos novos dados, precisamos eliminar os usuários antigos. Para encontrar os usuários, vamos utilizar o comando

```SQL
SQL> SELECT USERNAME FROM DBA_USERS WHERE DEFAULT_TABLESPACE NOT IN ('SYSAUX', 'SYSTEM') AND USERNAME NOT IN ('XS$NULL');

USERNAME
------------------------------
VETORH
GATEC_CONF
GATEC_FRC
GATEC_PRP
DB_INTEGRACAO
GATEC_SAF
GATEC_MEC
SAPIENSNFE
SAPIENS
RELOGIO_PONTO
REP

USERNAME
------------------------------
PERFSTAT
GSCOTTON
ORCAMENTO
INTRANET
AGRICOLA
SPATIAL_WFS_ADMIN_USR
DIP
MDDATA
ORACLE_OCM
SPATIAL_CSW_ADMIN_USR
APEX_PUBLIC_USER

USERNAME
------------------------------
SCOTT
QUERYTI
EXPTI
AUTOTRAC

26 rows selected.
```

Agora que já sabemos quem iremos eliminar, basta utilizar o comando `DROP` para cada usuário.

```sql
DROP USER SAPIENS CASCADE;
```

Caso bater uma preguiça ai, basta criar o script abaixo e rodar

```sql
DECLARE
CURSOR C_USERS IS
  SELECT USERNAME
    FROM DBA_USERS
   WHERE DEFAULT_TABLESPACE NOT IN ('SYSAUX', 'SYSTEM')
     AND USERNAME NOT IN ('XS$NULL');
BEGIN
  FOR R_USER IN C_USERS LOOP
    DBMS_OUTPUT.PUT('USUÁRIO ' || R_USER.USERNAME || ' ELIMINADO');
    EXECUTE IMMEDIATE 'DROP USER ' || R_USER.USERNAME || ' CASCADE';
  END LOOP;
END;
```

## Identificando backup

Agora que já preparamos o ambiente para receber os novos dados, vamos localizar o backup apropriado e começar a importação.

Dentro do ambiente UNIX do grupo, existe um diretório onde estão sendo salvo os backups `/u03/PROD`. Dentro desse diretório, estão os arquivos de `dump` e `log` que são gerados pela rotina de backup agendada.

Vamos listar e pegar o nome do arquivo que queremos

```bash
bash-4.3$ pwd
/u03/PROD
bash-4.3$ ls -la
total 516169680
drwxrwxrwx    2 oracle   oinstall       4096 Feb 10 12:00 .
drwxr-xr-x   10 oracle   oinstall        256 Jan 07 13:40 ..
-rw-r--r--    1 oracle   oinstall     775796 Feb 08 22:15 IMP_2017_02_08_2000_Teste.log
-rw-r--r--    1 oracle   oinstall     776444 Feb 09 22:14 IMP_2017_02_09_2000_Teste.log
-rw-r-----    1 oracle   oinstall 37738254336 Feb 08 12:22 PROD_2017_02_08_1200_11027005175.dmp
-rw-r--r--    1 oracle   oinstall     679740 Feb 08 12:22 PROD_2017_02_08_1200_11027005175.log
-rw-r-----    1 oracle   oinstall 37750165504 Feb 08 18:22 PROD_2017_02_08_1800_11032404928.dmp
-rw-r--r--    1 oracle   oinstall     681952 Feb 08 18:22 PROD_2017_02_08_1800_11032404928.log
-rw-r-----    1 oracle   oinstall 37751238656 Feb 08 23:22 PROD_2017_02_08_2300_11035795592.dmp
-rw-r--r--    1 oracle   oinstall     681873 Feb 08 23:22 PROD_2017_02_08_2300_11035795592.log
-rw-r-----    1 oracle   oinstall 37753454592 Feb 09 12:21 PROD_2017_02_09_1200_11044092021.dmp
-rw-r--r--    1 oracle   oinstall     680372 Feb 09 12:21 PROD_2017_02_09_1200_11044092021.log
-rw-r-----    1 oracle   oinstall 37753253888 Feb 09 18:22 PROD_2017_02_09_1800_11049717804.dmp
-rw-r--r--    1 oracle   oinstall     682794 Feb 09 18:22 PROD_2017_02_09_1800_11049717804.log
-rw-r-----    1 oracle   oinstall 37764997120 Feb 09 23:21 PROD_2017_02_09_2300_11052921808.dmp
-rw-r--r--    1 oracle   oinstall     680767 Feb 09 23:21 PROD_2017_02_09_2300_11052921808.log
-rw-r-----    1 oracle   oinstall 37760909312 Feb 10 12:21 PROD_2017_02_10_1200_11061578716.dmp
-rw-r--r--    1 oracle   oinstall     681611 Feb 10 12:21 PROD_2017_02_10_1200_11061578716.log
```

Para o nosso exemplo, vamos usar o arquivo `PROD_2017_02_10_1200_11061578716`

## Importando dados

Para efetuar a importação, vamos utilizar o comando `impdp`. Sua sintax é simples:

```bash
impdp <USUARIO>/<SENHA> dumpfile=<ARQUIVO.dmp> logfile=<LOGDOPROCESSO.LOG> directory=<DIRETORIO DO ARQUIVO DE DADOS>
```

Parametros

* USUARIO: usuário que tem permissão para efeutar o import (usuário dba ou system)
* SENHA: senha do usuário
* ARQUIVO.DMP: arquivo do backup exportado.
* DIRETORIO DO ARQUIVO DE DADOS: local onde está o arquivo de backup

Primeiro, vamos verificar os diretorórios. Dentro da pasta onde esta o arquivo de dados, no terminal, execute o comando `pwd` para listar o diretório atual.

```bash
bash-4.3$ pwd
/u03/PROD
```

Agora vamos verificar se existe um diretório para esse arquivo no ORACLE

```bash
sqlplus / as sysdba
SQL> SELECT DIRECTORY_NAME, DIRECTORY_PATH FROM DBA_DIRECTORIES;

DIRECTORY_NAME
------------------------------
DIRECTORY_PATH
--------------------------------------------------------------------------------
BKPSAP
/home/oracle/dumps

BKPDIARIO
/u03/PROD

XMLDIR
/u01/app/oracle/home/rdbms/xml


DIRECTORY_NAME
------------------------------
DIRECTORY_PATH
--------------------------------------------------------------------------------
BACKUP
/u03/PROD

BKPDIARIO2
/backup/oracle/DATAPUMP2

ORACLE_OCM_CONFIG_DIR2
/u01/app/oracle/home/ccr/state


6 rows selected.
```

Note, que existe o diretório `BKPDIARIO` com o caminho que precisamos.

Feito isso, vamos ao comano de importação, que já podemos preencher os campos de dumpfile e directory

```bash
impdp <USUARIO>/<SENHA> dumpfile=PROD_2017_02_10_1200_11061578716.dmp logfile=<LOGDOPROCESSO.LOG> directory=BKPDIARIO
```

O campo usuário e senha, vou usar um qualquer, para exemplo. Já o log, vamos informar o nome do arquivo que irá gerar durante o processo de importação. Com isso, nosso comando irá ficar

```bash
export ORACLE_SID=HM1
impdp system/oracle dumpfile=PROD_2017_02_10_1200_11061578716.dmp logfile=IMP_FROM_PROD_TO_HM.log directory=BKPDIARIO
```

***OBS***: Em ambiente linux/unix, tome cuidado com o jeito que o texto está escrito (Maíscula e Minúscula), pois, PROD_2017_02_10_1200_11061578716.DMP não é igual PROD_2017_02_10_1200_11061578716.dmp

Está pronto nosso comando. Só rodar e rezar!

## Importou, e agora?

Após a importação, existe algumas coisas importantes a serem feitas. A primeira, é alterar as senhas dos usuários, que em produção são super secretas.

```SQL
alter user sapiens identified by sapiens;
alter user vetorh identified by vetorh;
alter user db_integracao identified by ga;
alter user gatec_saf identified by ga;
alter user gatec_mec identified by mec;
```

Caso tenha algum outro, essa é a hora!

Após isso, com a exeriência e muita dor de cabeça, precisamos alterar algumas coisas que impactam na integração.

```sql

--Alterações na estrutura de integração de empresas do vetorh;
update vetorh.r030emp set arqins = '\\araraazul\seniorhomologacao\inst.ctrl', cfgint = 'seniorHomologacao';

--Alteração do nome das empresas no ERP
update sapiens.e070emp set nomemp = substr('HM -> ' || nomemp,1,100), sigemp = substr('HM '||codemp ,1,10);
update sapiens.e020snf set dirnel = 'BASE DE HOMOLAGAÇÃO';

UPDATE GATEC_SAF.GA_ALG_PARAMETROS
   SET PAD_SERVER_WEB_SERV = 'ARARAAZUL',
       PAD_PORTA_WEB_SERV = '80'
 WHERE PAD_PATH_WEB_SERV IS NOT NULL;

-- alterar servidor de webservice GATEC
-- GRP
UPDATE GATEC_SAF.GA_GRP_CONFIG 
   SET CON_SERVER_WEB_SERV = 'ARARAAZUL'
 WHERE CON_SERVER_WEB_SERV IS NOT NULL;

-- COMERCIAL
UPDATE GATEC_SAF.GA_ALG_PARAMETROS 
   SET PAD_SERVER_WEB_SERV = 'ARARAAZUL',
       PAD_PORTA_WEB_SERV = '8080'
 WHERE PAD_SERVER_WEB_SERV IS NOT NULL;

-- SAFRAS (BALANÇA)
UPDATE GATEC_SAF.GA_SAF_CONFIG_GERAL
   SET CFG_SERVER_WEB_SERV = 'ARARAAZUL',
       CFG_PORTA_WEB_SERV = '8080'
 WHERE CFG_SERVER_WEB_SERV IS NOT NULL;
```

Dados atualizados!