# be-nc-news - Backend Portfolio Project
This is my backend portfolio project, demonstrating a working implementation of a RESTful web API built using MVC framework in JavaScript, with a PostgresQL database.
## Node Dependencies
Upon installing, the following dependencies will be automatically installed and configured:
- express - Node.js web application framework
- pg - Node.js PostgresQL implementation
- pg-format - Allows for paramaterized queries to help prevent SQL injection
- dotenv - For loading environment variables from .env files that shouldn't be committed to the repository
- cors - Express middleware for allowing access to the API from a third party domain

The server also uses the built in `crypto` Node module to enable the storage of sha256 hashes in environmental variables rather than raw values, for basic token authentication.
## Requirements
`git` to clone the repository, `npm` 7.22.0 or higher to install the dependencies, and `psql` to run the database.
## Installation
To install, navigate to the parent folder where you want to clone, and enter the following commands:
```
git clone https://github.com/praisedpern/be-nc-news.git
cd be-nc-news
npm install
```
To run a local development instance, you will first need a `.env.development` file. To generate this file, you can run the included `generate-env.sh` script. This script will ask you to input a token. Each query to the API must be passed with this token as a `?token={your_token}` query, or the server will respond with a 403 status. The token acts like a password and can be anything you like. If you forget it, you'll need to run `generate-env.sh` again with a new one and restart the server.

Please note that running the script again will overwrite the file!

To generate the file run:
```
sudo chmod +x ./generate-env.sh
./generate-env.sh
```
## Usage
To start the local development instance, run `npm start` in your terminal.

To see all available endpoints, send a GET request to /api once the server is running.

This APi is hosted at https://very-good-news.herokuapp.com
