require('dotenv').config();
const { BOT_TOKEN } = process.env;
const Trello = require('../Classes/Client');

const client = new Trello();

client.login(BOT_TOKEN);