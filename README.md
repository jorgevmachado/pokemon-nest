<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Projeto criado com o intuito de aperfeiçoar os meus conhecimentos com rest API.
Trata-se de um rest API que realiza uma requisição ao projeto https://pokeapi.co/api/v2 e trata os dados retornados.
Retornando apenas os dados necessários para a aplicação.

## request
Cria uma Conta de usuário simples
É necessário alterar manualmente no Banco de dados
o campo role para'admin' para ter acesso a rota
de criação de pokemons
```bash
http://localhost:3001/auth/signup - POST 

    {
	  "name": "USER",
	  "email": "user@gmail.com",
	  "password": "123456",
	  "passwordConfirmation": "123456"
    }
    

```
Realiza o login do usuário
Essa requisição gera um token JWT, necessário para
acessar as demais rotas
```bash
http://localhost:3001/auth/signin - POST

{
 "email": "admin@gmail.com",
 "password": "123456"
}  


```

Salva no banco de dados os dados basicos da lista de pokemons que vem da api e retorna somente o name, url e order.
```bash
http://localhost:3001/pokemons/generate - GET
```

Retorna do Banco de dados a lista de pokemons salvos paginado, se o limit for menor que 10, o request, atualiza os dados
mais informações
```bash
http://localhost:3001/pokemons?page=1&limit=10 - GET
```

Retorna Somente um pokemon pelo nome
```bash
http://localhost:3001/pokemons/bulbasaur
```

No Arquivo insomnia tem as requisições prontas para serem importadas no insomnia

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

Nest is [MIT licensed](LICENSE).
