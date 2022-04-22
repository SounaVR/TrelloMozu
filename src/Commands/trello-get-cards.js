const { TRELLO_API_KEY, TRELLO_API_TOKEN } = process.env;
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const { getLists } = require('../../utils/u');
const fetch = require('node-fetch');

module.exports = {
    name: 'trello-get-cards',
    description: 'Récupère les cartes d\'une liste Trello',
    async execute(client, interaction) {
        const row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('select')
                        .setPlaceholder('Choisissez une liste')
                        .addOptions([
                            {
                                label: 'To-Do',
                                description: 'Liste des tâches à faire',
                                value: '62586f671695db78c730e61f'
                            },
                            {
                                label: 'Doing',
                                description: 'Liste des tâches en cours',
                                value: '62586f671695db78c730e620'
                            },
                            {
                                label: 'Done',
                                description: 'Liste des tâches terminées',
                                value: '62586f671695db78c730e621'
                            }
                        ])
                );

        await interaction.reply({ components: [row] });

        const filter = i => {
            i.deferUpdate();
            return i.user.id === interaction.user.id;
        } //user filter (author only)
        const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: 'SELECT_MENU', time: 60000, fetchReply: true }); //collector for 60 seconds    

        collector.on('collect', selectMenu => {
            if (!selectMenu.isSelectMenu()) return;
            const id = selectMenu.values[0];

            fetch(`https://api.trello.com/1/lists/${id}/cards?key=${TRELLO_API_KEY}&token=${TRELLO_API_TOKEN}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            })
            .then(response => {
                return response.text();
            })
            .then(async text => {
                let parse = JSON.parse(text);
                let listName = getLists().find(element => element.value === id).name;
                let txt = [];

                parse.map(element => {
                    txt.push(`${element.name}`);
                });

                const embed = new MessageEmbed()
                    .setAuthor({ name: 'Liste des cartes', iconURL: client.user.displayAvatarURL() })
                    .setColor('RANDOM')
                    .addField(`${listName}`, `${txt.join('\n')}`)
                    .setTimestamp()

                collector.stop();
                return interaction.editReply({ embeds: [embed], components: [] });
            })
            .catch(err => {
                console.error(err);
                const errorEmbed = new MessageEmbed()
                    .setColor('DARK_RED')
                    .setTitle(`An error occured. Check logs.`)
                return interaction.editReply({ content: `❌`, embeds: [errorEmbed] });
            });         
        });
    }
}