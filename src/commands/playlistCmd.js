const Client = require("../classes/Client");
const { Message } = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {Message} message
 * @param {Array} args
 */
var command = async (client, message, args) => {
  const { guild, channel, member } = message;

  const player = client.player.get(guild.id);

  if (!player)
    return channel
      .send("**😭 i can't**")
      .then(m => client.cacheReplys.set(message.id, m))
      .catch(console.error);

  if (!client.mongo.isConnected())
    return channel
      .send("**can't rich the database**")
      .then(m => client.cacheReplys.set(message.id, m))
      .catch(console.error);

  client.mongo
    .db("Discordapp")
    .collection("playlist")
    .findOne({ userID: member.id }, async (err, db) => {
      if (err) return console.error(err);
      if (!db) {
        channel
          .send("you don't have playlist, creating your playlist...")
          .then(m => client.cacheReplys.set(message.id, m))
          .catch(console.error);

        return client.mongo
          .db("Discordapp")
          .collection("playlist")
          .insertOne({ userID: member.id, playlist: [] });
      }

      if (db.playlist.length === 0)
        return channel
          .send("**you're playlist is empty**")
          .then(m => client.cacheReplys.set(message.id, m))
          .catch(console.error);

      var playlist = [];

      for (index in db.playlist) {
        var [song] = await client.findSong(db.playlist[index]);

        if (!song) continue;

        playlist.push({ ...song, user: member.user, skipCount: new Set() });
      }

      client.queue = [...client.queue, ...playlist];

      channel
        .send(`**playlist loaded ${playlist.length} of ${db.playlist.length}**`)
        .then(m => {
          client.cacheReplys.set(message.id, m.id);

          if (player.playing) return;

          player.play(client.queue[0].track);

          m.edit(
            `🎉 partyyy ${client.queue[0].info.title} - [\`${
              client.queue[0].info.author
            }\`]`
          );
        })
        .catch(console.error);
    });
};

module.exports = command;
