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

  client.reset();
  player.stop();
  client.player.leave(guild.id);

  channel
    .send("**everything was rest & stopped !!!**")
    .then(m => client.cacheReplys.set(message.id, m))
    .catch(console.error);
};

module.exports = command;
