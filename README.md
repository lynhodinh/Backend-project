<h1 align="center">Boardgames API</h1>

## Project Summary

A RESTful API that allows users to interact with board game review articles by posting, voting, commenting, and deleting.

The app.js file contains different endpoints for making HTTP requests. These endpoints follow the MVC architecture and provide instructions for communicating with the database and handling data.

## Links

Corresponding front-end application: https://github.com/lynhodinh/nc-games

Hosted API: https://nc-board-game-reviews.onrender.com/api 
(May take a few seconds to load)

## Setup clone locally
1. Fork and clone this repository
2. Run `npm i`
3. Set up `.env` files (More info below)
4. Set up the databases using `npm run setup-dbs`
5. Seed the database using `npm run seed`

## Database Configuration 

To establish a successful local connection to the databases, create two files: 

• `.env.test`

• `.env.development` 

In each file, include the following line:

PGDATABASE=<database_name_here>

Replace '<database_name_here>' with the corresponding database name, which should be 'nc_games_test' for the test environment and 'nc_games' for the development environment.

## Testing

To run all the tests for the app, use:
```
npm t app
```
