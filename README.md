# gradtrack

Trabalho prático da disciplina de DCC089 - Teste de Software.

## Grupo

- Mateus Henrique Souza Silva {2020006841} - Sistemas de Informação
- Mirna Mendonça e Silva {2021421940} - Ciência da Computação
- Vinicius Silva Gomes {2021421869} - Ciência da Computação

## Sobre o sistema

A ideia é desenvolver um sistema que permita o cadastro de cursos, alunos e disciplinas, funcionando como uma alternativa mais organizada e visual ao extrato de integralização tradicional. Nesse sistema, cada curso poderia ter sua grade curricular registrada, com informações sobre as disciplinas, suas cargas horárias e categorias (obrigatória, optativa, complementar etc.). Os alunos seriam associados a um curso específico e poderiam atualizar o status de cada disciplina, marcando-a como concluída ou não, de forma que o sistema armazenasse esse progresso individualmente. A partir desses dados, seria possível gerar automaticamente um extrato claro e intuitivo, mostrando tanto a quantidade de horas já integralizadas quanto a carga horária ainda necessária para a conclusão do curso. Assim, em vez de lidar com relatórios pouco amigáveis, o estudante teria acesso a uma visão consolidada e simplificada de seu percurso acadêmico, facilitando o acompanhamento das disciplinas cursadas e do que ainda falta para formar.

As funcionalidades principais do sistema serão disponibilizadas por meio de uma API, responsável por centralizar a lógica de negócio e a comunicação com o banco de dados. Dessa forma, o bot no Discord atuará como uma interface de acesso, permitindo que os usuários interajam com os recursos de forma simples e intuitiva, sem precisar lidar diretamente com a complexidade da aplicação. Por meio de comandos no servidor do Discord, será possível consumir as funcionalidades expostas pela API, garantindo uma integração eficiente e uma experiência de uso acessível e prática.

## Possíveis tecnologias do sistema

Para a escrita do sistema, queremos utilizar as seguintes tecnologias:

- API:
  - Node.js, como ambiente de execução do servidor;
  - TypeScript, como linguagem de programação principal;
  - Express, como framework web para o Node.js, para a criação das rotas que recebem dados e enviam as respostas para os usuários;
  - PostgresSQL, como banco de dados para persistir as informações cadastradas;
  - Prisma, como ORM para simplificar a realização de operações no banco de dados e geração e aplicação das migrações.
- Bot no Discord:
  - Python, como linguagem de programação principal;
  - discord.py, como biblioteca para integração com a API do Discord e implementação dos comandos e eventos do bot.
