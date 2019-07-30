const Client = require("../classes/Client");
const { Message } = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {Message} message
 */
var command = async (client, message) => {
  const { guild, member, channel } = message;
  const { voiceChannel } = member;

  const player = client.player.get(guild.id);

  if (!player)
    return channel
      .send("**😭 i can't**")
      .then(m => client.cacheReplys.set(message.id, m))
      .catch(console.error);

  if (!player.playing)
    return channel
      .send("**⚠ you can't skip**")
      .then(m => client.cacheReplys.set(message.id, m))
      .catch(console.error);

  var currentSong = client.queue[0];

  var reqCount = voiceChannel.members.filter(m =>
    currentSong.skipCount.has(m.id)
  ).size;

  var reqNeed = voiceChannel.members.filter(m => !m.user.bot).size;

  if (currentSong.user.id != member.id && reqCount < reqNeed) {
    return channel
      .send(`please vote to skip: [\`${reqCount}/${reqNeed}\`]`)
      .then(m => client.cacheReplys.set(message.id, m))
      .catch(console.error);
  }

  channel
    .send(`**skip ${client.queue[0].info.title} by ${member}**`)
    .then(m => client.cacheReplys.set(message.id, m))
    .catch(console.error);

  player.emit("end", "SKIP");
};

module.exports = command;
