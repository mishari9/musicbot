const Client = require("./classes/Client");
const config = require("../config");
const { Collection } = require("discord.js");

const client = new Client(config.TOKEN, config.NODES, config.MONGODB);

const recentlyUsed = new Collection();

const playCmd = require("./commands/playCmd");
const skipCmd = require("./commands/skipCmd");
const volCmd = require("./commands/volCmd");
const queueCmd = require("./commands/queueCmd");
const stopCmd = require("./commands/stopCmd");
const repeatCmd = require("./commands/repeatCmd");
const helpCmd = require("./commands/helpCmd");
const playlistCmd = require("./commands/playlistCmd");
const setavatarCmd = require("./commands/setavatarCmd");
const statusCmd = require("./commands/statusCmd");

client.on("message", async message => {
  const { content, author, guild, channel, member } = message;

  if (author.bot) return;
  if (channel.type != "text") return;
  if (content.includes("discord.gg")) return;

  const { me } = guild;
  const { voiceChannel, voiceChannelID } = member;

  if (!voiceChannel || member.deaf) return;
  if (me.voiceChannel) {
    if (me.voiceChannelID != voiceChannelID) return;
  }

  if (member.roles.find(r => r.name.toLowerCase() == "forbidden")) return;

  const args = content.replace(/ +/g, " ").split(" ");
  const cmd = args
    .shift()
    .trim()
    .toLowerCase();

  if (recentlyUsed.get(member.id) == cmd)
    return channel
      .send("**please wait few secounds**")
      .then(m => m.delete(2000))
      .catch(console.error);

  try {
    if (["p", "play"].includes(cmd)) playCmd(client, message, args);
    else if (["pl", "playlist"].includes(cmd))
      playlistCmd(client, message, args);
    else if (["s", "skip"].includes(cmd)) skipCmd(client, message);
    else if (["v", "vol", "volume"].includes(cmd))
      volCmd(client, message, args);
    else if (["q", "queue"].includes(cmd)) queueCmd(client, message);
    else if (["stop"].includes(cmd)) stopCmd(client, message);
    else if (["r", "repeat"].includes(cmd)) repeatCmd(client, message);
    else if (["sv", "setavatar"].includes(cmd)) setavatarCmd(client, message);
    else if (["status"].includes(cmd)) statusCmd(client, message, args);
    else if (["h", "help"].includes(cmd)) helpCmd(client, message);
  } catch (e) {}

  recentlyUsed.set(member.id, cmd);

  setTimeout(
    () => (recentlyUsed.get(member.id) ? recentlyUsed.delete(member.id) : 0),
    1500
  );
});

client.on("messageUpdate", (oldMessage, newMessage) =>
  client.emit("message", newMessage)
);

client.on("messageDelete", message =>
  client.cacheReplys.get(message.id)
    ? client.cacheReplys.get(message.id).delete(1000)
    : 0
);
