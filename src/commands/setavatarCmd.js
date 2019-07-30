const Client = require("../classes/Client");
const { Message } = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {Message} message
 */
var command = async (client, message) => {
  const { channel, member, attachments } = message;

  if (!member.hasPermission("ADMINISTRATOR"))
    return channel
      .send("**only admin can change my avatar**")
      .then(m => client.cacheReplys.set(message.id, m))
      .catch(console.error);

  if (!attachments.first())
    return channel
      .send("**image not found**")
      .then(m => client.cacheReplys.set(message.id, m))
      .catch(console.error);

  client.user
    .setAvatar(attachments.first().url)
    .then(clientUser =>
      channel
        .send("avatar editd:", { files: [clientUser.avatarURL] })
        .then(m => client.cacheReplys.set(message.id, m))
        .catch(console.error)
    )
    .catch(e =>
      channel.send("**change avatar faild, try again after few hours**")
    );
};

module.exports = command;
