const { MessageEmbed } = require('discord.js');
const moment  = require("moment");
moment.locale("fr");

module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        const channel = client.channels.cache.find(ch => ch.id === "930481568840040448");
        
        client.user.setActivity("Mozu", { type: "WATCHING" });

        const embed = new MessageEmbed()
            .setTitle(`[SYSTEM START] Log du ${moment().format('DD/MM/YYYY | HH:mm:ss')}`)
            .setDescription(`${client.user.username} just started !`)
            .setColor("#1DCC8F")
        channel.send({ embeds: [embed] });

        console.log('✅ Bot connected and ready !');
    }
}