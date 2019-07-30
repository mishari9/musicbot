const Client = require("../classes/Client");
const { Message, RichEmbed } = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {Message} message
 */
var command = async (client, message) => {
  const { guild, member, channel, content } = message;

  const player = client.player.get(guild.id);

  if (!player)
    return channel
      .send("**😭 i can't**")
      .then(m => client.cacheReplys.set(message.id, m))
      .catch(console.error);

  if (client.queue.length === 0)
    return channel
      .send("**you won't able to view queue**")
      .then(m => client.cacheReplys.set(message.id, m))
      .catch(console.error);

  channel
    .send(
      `**${content}**`,
      new RichEmbed()
        .setAuthor(guild.me.displayName)
        .setThumbnail(client.user.avatarURL)
        .setDescription(
          client.queue
            .map(song => `**${song.info.title}** by ${song.user}`)
            .join("\n")
        )
        .setFooter(member.displayName, member.user.avatarURL)
    )
    .then(m => client.cacheReplys.set(message.id, m))
    .catch(console.error);
};

module.exports = command;
