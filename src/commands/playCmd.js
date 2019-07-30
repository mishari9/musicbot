const Client = require("../classes/Client");
const { Message } = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {Message} message
 * @param {Array} args
 */
var command = async (client, message, args) => {
  const { guild, member, channel } = message;
  const { voiceChannelID } = member;

  var player = client.player.get(guild.id);

  if (!player) {
    player = await client.player.join(
      {
        guild: guild.id,
        channel: voiceChannelID,
        host: client.player.nodes.first().host
      },
      { selfdeaf: true }
    );

    if (!player)
      return channel
        .send("**😭 i can't**")
        .then(m => client.cacheReplys.set(message.id, m))
        .catch(console.error);
  }

  if (args.length === 0)
    return channel
      .send("**play `URL or TITLE`**")
      .then(m => client.cacheReplys.set(message.id, m))
      .catch(console.error);

  const [song] = await client.findSong(
    args.join(" ").includes("http")
      ? args.join(" ")
      : `ytsearch: ${args.join(" ")}`
  );

  if (!song)
    return channel
      .send(`**🤐 ${args.join(" ")} not found !!!**`)
      .then(m => client.cacheReplys.set(message.id, m))
      .catch(console.error);

  client.queue.push({
    ...song,
    user: member.user,
    skipCount: new Set()
  });

  if (player.playing) {
    return channel
      .send(`Queued ${song.info.title} - [\`${song.info.author}\`]`)
      .then(m => client.cacheReplys.set(message.id, m))
      .catch(console.error);
  }

  player.play(song.track);

  channel
    .send(`🎉 partyyy ${song.info.title} - [\`${song.info.author}\`]`)
    .then(m => client.cacheReplys.set(message.id, m))
    .catch(console.error);
};

module.exports = command;
