![image](https://github.com/pedromonteir01/clashRoyale-battle/assets/123501825/95b838a3-385a-4ebd-b7a7-ad0df9b24891)
# Clash Royale Battle REST API
Uma api idealizada com base nas cartas do jogo [Clash Royale](https://supercell.com/en/games/clashroyale/), onde apartir de suas rotas, simula uma batalha entre elas.

## Tecnologias
- [X] ECMAscript
- [X] Node.JS (v18.17.1)
- [X] PostgreSQL (v16)
- [X] Git (v2.44.0)

### - Bibliotecas utilizadas
- [X] Express
- [X] Nodemon
- [X] PG


## Configuração
É preciso também ter instalado o [Node.JS](https://nodejs.org/en/download), o [PostgreSQL](https://www.postgresql.org/download/) e por último, o [Git](https://git-scm.com/download/) para conseguir clonar o repositório anexado no GitHub.

para clonar, executar `git clone https://github.com/pedromonteir01/clashRoyale-battle.git`

Ao clonar o projeto, o comando ` npm i `deve ser digitado para instalar as dependências necessárias.
> Exemplo: pasta node_modules

Caso seu `psql ou pgAdmin4` tenha outras configurações (como porta e usuário), alterar ba variável pool dentro do arquivo `index.js`

>Base geral da configuração do pool:
```
Pool
├── User(postgres)
├── Host(localhost)
├── Port(5432)
├── Password(1234)
└── Database(* nome de sua escolha *)
```