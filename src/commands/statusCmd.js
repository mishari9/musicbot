const Client = require("../classes/Client");
const { Message } = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {Message} message
 * @param {Array} args
 */
var command = async (client, message, args) => {
  const { channel, member, attachments } = message;

  if (!member.hasPermission("ADMINISTRATOR"))
    return channel
      .send("**only admin can change my avatar**")
      .then(m => client.cacheReplys.set(message.id, m))
      .catch(console.error);

  if (args.length === 0) {
    return client.user.setActivity(null).then(() => {
      channel
        .send("**status was rest**")
        .then(m => client.cacheReplys.set(message.id, m))
        .catch(console.error);
    });
  }

  client.user
    .setActivity(args.join(" "), { type: "LISTENING" })
    .then(clientUser => {
      channel
        .send(`**status was change to ${clientUser.game.name}**`)
        .then(m => client.cacheReplys.set(message.id, m))
        .catch(console.error);
    });
};

module.exports = command;
