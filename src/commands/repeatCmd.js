const Client = require("../classes/Client");
const { Message } = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {Message} message
 */
var command = async (client, message) => {
  const { guild, channel } = message;

  const player = client.player.get(guild.id);

  if (!player)
    return channel
      .send("**😭 i can't**")
      .then(m => client.cacheReplys.set(message.id, m))
      .catch(console.error);

  client.repeat = !client.repeat;

  channel
    .send(`**repeat mode: ${client.repeat ? "ON" : "OFF"}**`)
    .then(m => client.cacheReplys.set(message.id, m))
    .catch(console.error);
};

module.exports = command;
