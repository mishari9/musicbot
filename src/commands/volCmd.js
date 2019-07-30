const Client = require("../classes/Client");
const { Message } = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {Message} message
 * @param {Array} args
 */
var command = async (client, message, args) => {
  const { guild, channel } = message;

  const player = client.player.get(guild.id);

  if (!player) return channel.send("**😭 i can't**");

  const volume = args.shift();

  if (!volume)
    return channel
      .send(`**volume: ${client.volume}**`)
      .then(m => client.cacheReplys.set(message.id, m))
      .catch(console.error);

  if (isNaN(volume))
    return channel
      .send("**expected 0-150 number not string**")
      .then(m => client.cacheReplys.set(message.id, m))
      .catch(console.error);

  if (volume > 150)
    return channel
      .send("**this number is too high to set**")
      .then(m => client.cacheReplys.set(message.id, m))
      .catch(console.error);

  client.volume = volume;

  player.volume(volume);

  channel
    .send(`**volume changed to [\`${client.volume}\`]**`)
    .then(m => client.cacheReplys.set(message.id, m))
    .catch(console.error);
};

module.exports = command;
