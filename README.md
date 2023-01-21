# Northcoders House of Games API

This is a back end solo project whe I have created a back end API containing categegories, users, reviews and comments, this server has several available endpoints for example /api that provides a JSON representation of the available endpoints or /api/users that queries the db and returns all of the available users.
To view all of the available endpoints and requests you are able to make to the database there is an endpoints.json file.

## NC-Games API link 

https://nc-games-api-53j2.onrender.com/api
This will take you to the full API where you can see a JSON representation of all the currently available end points including example results and example bodies to query the database with.

## Minimum requirements

For this project ensure you have installed the minimum versions of node and postgres 

    Node: v19.0.1
    Postgres: postgres (PostgreSQL) 14.5 (Homebrew)

## Installation 

To use this repository clone this repository down on to your local machine 
        git clone https://github.com/StaceyCP/NC-games-project.git

In order to get set up you will need to install the relevent dependencies
        npm install

Check that your package.json contains these dependencies: 

        "dependencies": {
            "dotenv": "^16.0.0",
            "express": "^4.18.2",
            "pg": "^8.7.3"
        },
        "devDependencies": {
            "husky": "^8.0.2",
            "jest": "^27.5.1",
            "jest-extended": "^2.0.0",
            "jest-sorted": "^1.0.14",
            "pg-format": "^1.0.4",
            "supertest": "^6.3.3"
        }

The next step to getting up and running is setting up your .env files see instructions below.

## Database set up and .ENV files

This Board games API has two databases one for testing and one for development to get these up and running you will need to create two .env files.

.env.test - This should be set up using PGDATABASE=nc_games_test

and 

.env.development - This should be set up using PGDATABASE=nc_games

Once these files have been initiallised you are good to go!

The test file for the db queries within app will re-seed using the available test data 
If you want to set-up using the developer database there are scripts set up to initialise the database and seed it using the dev data
    1:    npm run setup-dbs  
            - This will make the database 
            
    2:    npm run seed   
            - This will seed the database with the developer data

# Testing

This repository contains two test files one for the seed file utility tests to run this file you can use "npm test utils.test.js"
There is a second end to end test file to test the database query functions in order to run these tests you can use the command "npm test app.test.js"
To run both test files simply use "npm test"

## Husky

To ensure we are not commiting broken code this project makes use of git hooks. Git hooks are scripts triggered during certain events in the git lifecycle. Husky is a popular package which allows us to set up and maintain these scripts. This project makes use a _pre-commit hook_. When we attempt to commit our work, the script defined in the `pre-commit` file will run. If any of our tests fail than the commit will be aborted.

