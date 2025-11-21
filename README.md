# gradtrack

Trabalho prático da disciplina de DCC089 - Teste de Software.

## Grupo

- Mateus Henrique Souza Silva {2020006841} - Sistemas de Informação
- Mirna Mendonça e Silva {2021421940} - Ciência da Computação
- Vinicius Silva Gomes {2021421869} - Ciência da Computação

## Sobre o sistema

Gradtrack permite o cadastro de cursos, alunos e disciplinas, funcionando como uma alternativa mais organizada e visual ao extrato de integralização tradicional. Nesse sistema, cada curso pode ter sua grade curricular registrada, com informações sobre as disciplinas, suas cargas horárias e categorias (obrigatória, optativa, complementar etc.). Os alunos são associados a um curso específico e podem atualizar o status de cada disciplina, marcando-a como concluída ou não, de forma que o sistema armazene esse progresso individualmente. A partir desses dados, é possível gerar automaticamente um extrato claro e intuitivo, mostrando tanto a quantidade de horas já integralizadas quanto a carga horária ainda necessária para a conclusão do curso. Assim, em vez de lidar com relatórios pouco amigáveis, o estudante tem acesso a uma visão consolidada e simplificada de seu percurso acadêmico, facilitando o acompanhamento das disciplinas cursadas e do que ainda falta para formar.

As funcionalidades principais do sistema são disponibilizadas por meio de uma API, responsável por centralizar a lógica de negócio e a comunicação com o banco de dados. Dessa forma, o bot no Discord atuará como uma interface de acesso, permitindo que os usuários interajam com os recursos de forma simples e intuitiva, sem precisar lidar diretamente com a complexidade da aplicação. Por meio de comandos no servidor do Discord, é possível consumir as funcionalidades expostas pela API, garantindo uma integração eficiente e uma experiência de uso acessível e prática.

## Tecnologias do sistema

Para a escrita do sistema, utilizamos as seguintes tecnologias:

- API:
  - Node.js, como ambiente de execução do servidor;
  - TypeScript, como linguagem de programação principal;
  - Express, como framework web para o Node.js, para a criação das rotas que recebem dados e enviam as respostas para os usuários;
  - PostgresSQL, como banco de dados para persistir as informações cadastradas;
  - Prisma, como ORM para simplificar a realização de operações no banco de dados e geração e aplicação das migrações;
  - Jest, como framework de teste para escrita e coleta das informações de cobertura.
- Bot no Discord:
  - Python, como linguagem de programação principal;
  - discord.py, como biblioteca para integração com a API do Discord e implementação dos comandos e eventos do bot.

## Como executar o sistema

Para executar o sistema, é preciso ter instalado na máquina o Node.js em sua versão 22.\* e o gerenciador de pacotes de sua preferência (para desenvolvimento utilizamos o npm). Além disso, é necessário que o usuário possua o Docker instalado no sistema. Utilizaremos ele para subir a instância do banco de dados PostgreSQL utilizado pelo servidor do sistema.

Por fim, antes de executar o sistema, é necessário definir as variáveis de ambiente. Para tanto, basta criar um arquivo `.env` na raiz do projeto e copiar o conteúdo de `.env.example` para ele.

```
PORT=3333
NODE_ENV = "development"
DATABASE_URL="postgresql://postgres:docker@localhost:5432/gradtrack?schema=public"
```

Para instanciar o banco de dados com o Docker, baixar os pacotes necessários para a aplicação e executar as `migrations`, os comandos

```
cd server
docker compose up -d
npm install
npx prisma db push
```

devem ser executados.

Com o ambiente configurado, o comando

```
npm run start:dev
```

deve ser usado para executar a API.

Para executar o bot, primeiramente é necessário ter uma conta no Discord e seguir o guia presente [aqui](https://discordpy.readthedocs.io/en/stable/discord.html) para criar a aplicação do bot e convidá-lo para um servidor que você tenha permissões. As permissões necessárias são apenas de enviar mensagens, verificar o histórico de mensagens e visualizar os canais. Após isso, utilizando o modo de desenvolvedor do Discord, é necessário [recuperar o ID do servidor](https://cybrancee.com/learn/knowledge-base/how-to-find-a-discord-guild-id/) e substituir a linha

```
MY_GUILD = discord.Object(id=seu-id-aqui)
```

no arquivo `bot.py` com o ID do servidor copiado.

Após isso, os comandos a seguir devem ser executados para criar o ambiente virtual Python, ativá-lo, instalar os pacotes necessários e, por fim, executar o bot.

```
cd bot
python3 -m venv .venv
source .venv/bin/activate
pip3 install -r requirements.txt
python3 bot.py
```

## Como executar os testes

Para executar o conjunto de testes de unidade e de integração que foram escritos, uma vez que o ambiente de execução do servidor tenha sido configurado e você está com o terminal na pasta dele, basta executar os comandos

```
npm run test:unit
```

para executar os testes de unidade e

```
npm run test:integration
```

para executar os testes de integração. Os testes de integração, para serem executados, criam um novo schema no banco de dados e executam as requisições lá. Após ter sido executado, o schema é deletado e, portanto, o banco de produção não é prejudicado pela execução dos testes de integração.

Por fim, o comando

```
npm run test:coverage
```

pode ser executado para verificar a cobertura dos testes em relação ao sistema todo.
