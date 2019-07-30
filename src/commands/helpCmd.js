const Client = require("../classes/Client");
const { Message } = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {Message} message
 */
var command = async (client, message) => {
  const { author, guild, channel } = message;

  var invite = await guild.me.voiceChannel.createInvite({ maxUses: 1 });

  const helpContent = [
    `hello, **i'm ${guild.me.displayName}**`,
    `- **p,play** \`URL or TITLE\``,
    `- **pl,playlist** \`playlist name or none\``,
    `- **s,skip** \`none\``,
    `- **v,vol,volume** \`number or none\``,
    `- **r,repeat** \`none\``,
    `- **stop** \`none\``,
    `- **q,queue** \`none\``,
    `- **h,help** \`none\``,
    `- 🌟 **status** \`content or none\``,
    `- 🌟 **sv,setavatar** \`image\``,
    `\n**you can use me in ${guild.name} (||${invite.url}||)**`,
    "*`~ made by global team`*"
  ];

  author
    .send(helpContent.join("\n"))
    .then(m => client.cacheReplys.set(message.id, m))
    .catch(e => channel.send(helpContent.join("\n")));
};

module.exports = command;
