## Introduction

This is simple CRUD Review API for passing test task from [Travling.id](https://travling.id). This is opensource, feel free to use and bought me.

## Route

-   User => http://host:port/users
-   Review => http://post:port/reviews

## Prerequiste

-   Node.js
-   MySQL
-   Express

## Installation

### Clone

    $ git clone https://github.com/nukumalik/travling.git
    $ cd travling
    $ npm install

### Create Enviroment Variable

    $ cp .env.example .env
    $ nano .env

Please make sure you edit the database (mongodb) uri in .env file before you start development server

### Start Development Server

    $ npm start

### Other Depedencies

-   bcryptjs
-   mysql
-   multer
