const { Client, Collection } = require("discord.js");
const config = require('../utils/config');

module.exports = class Trello extends Client {
    constructor() {
        super({
            intents: 1799,
            allowedMentions: { parse: ["users", "roles"], repliedUser: true },
            restTimeOffset: 250
        });
        require("../Handlers/Events")(this);
        require("../Handlers/Commands")(this);
        this.commands = new Collection();
        this.config = config;
    }
}