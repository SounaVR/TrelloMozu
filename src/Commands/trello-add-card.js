const { TRELLO_API_KEY, TRELLO_API_TOKEN } = process.env;
const { MessageEmbed } = require('discord.js');
const { getLists } = require('../../utils/u');
const fetch = require('node-fetch');

module.exports = {
    name: 'trello-add-card',
    description: 'Ajoute une carte à une liste Trello',
    options: [
        {
            name: 'idlist',
            description: 'L\'id de la liste où la carte va être ajoutée',
            type: 'STRING',
            required: true,
            choices: getLists()
        },
        {
            name: 'nom',
            description: 'Le nom de la carte',
            type: 'STRING',
            required: true
        }
    ],
    async execute(client, interaction) {
        if (!client.config.owners.includes(interaction.user.id)) return interaction.reply('❌');
        const { options } = interaction;
        const idlist = options.getString('idlist');
        const cardName = options.getString('nom');
        let listName = getLists().find(element => element.value === idlist).name;
        
        fetch(`https://api.trello.com/1/cards?idList=${idlist}&key=${TRELLO_API_KEY}&token=${TRELLO_API_TOKEN}&name=${cardName}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            }
        })
        .then(response => {
            const embed = new MessageEmbed()
                .setColor('RANDOM')
                .setTitle(`Carte "${cardName}" ajoutée dans la liste "${listName}"`)
            interaction.reply({ content: `Réponse: ${response.status} ✅`, embeds: [embed] });
            return response.text();
        })
        // .then(text => console.log(text))
        .catch(err => {
            console.error(err);
            const errorEmbed = new MessageEmbed()
                .setColor('DARK_RED')
                .setTitle(`An error occured. Check logs.`)
            interaction.reply({ content: `❌`, embeds: [errorEmbed] });
        });
    }
}