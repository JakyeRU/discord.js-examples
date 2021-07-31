const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('../config.json')

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}.`)

    if (!config["reaction-role"]) {
        console.warn('Warning: No role has been set for this command. Please check config.json (reaction-role).')
    }
})

client.on('message', async message => {
    // Checking if the message author is a bot.
    if (message.author.bot) return false;

    // Getting the role by ID.
    const Role1 = await message.guild.roles.fetch(config["reaction-role"]);
    // Making sure the role exists.
    if (!Role1) return message.channel.send(`Couldn't find any role with the id \`${config["reaction-role"]}\`. Please check \`config.json (reaction-role)\` and make sure it contains a valid role id.`)

    // Creating a filter.
    const Filter = (reaction, user) => user.id === message.author.id;

    // Creating the embed message.
    const Embed = new Discord.MessageEmbed()
        .setDescription(`React with 😎 to get the ${Role1} role.`)

    // Awaiting for the embed message to be sent.
    const reactionMessage = await message.channel.send(Embed);

    // Reacting to the embed message.
    await reactionMessage.react('😎');

    // Awaiting a reaction to the embed message. Time is measured in ms. (30000 ms - 30 seconds)
    reactionMessage.awaitReactions(Filter, {max: 1, time: 30000, errors: ['time']}).then(collected => {
        // Getting the first reaction in the collection.
        const reaction = collected.first();

        // Creating a switch statement for reaction.emoji.name.
        switch (reaction.emoji.name) {
            case '😎':
                // Checking if the member already has the role.
                if (message.member.roles.cache.has(Role1.id)) {
                    message.member.roles.remove(Role1).then(() => {
                        reactionMessage.edit(new Discord.MessageEmbed().setDescription(`${Role1} has been removed from ${message.author}.`))
                    }).catch(error => {
                        reactionMessage.edit(new Discord.MessageEmbed().setDescription(`Couldn't remove ${Role1} from ${message.author}.`))
                        console.error(error)
                    })
                } else {
                    // Adding the role.
                    message.member.roles.add(Role1).then(() => {
                        reactionMessage.edit(new Discord.MessageEmbed().setDescription(`${Role1} has been added to ${message.author}.`))
                    }).catch(error => {
                        reactionMessage.edit(new Discord.MessageEmbed().setDescription(`Couldn't add ${Role1} to ${message.author}.`))
                        console.error(error)
                    })
                }

                reaction.remove()
                // Breaking the switch statement to make sure no other cases are executed.
                break
        }
    })
});

client.login(process.env.DISCORD_AUTH_TOKEN)