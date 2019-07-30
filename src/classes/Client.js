const { Client, Collection } = require("discord.js");
const { PlayerManager } = require("discord.js-lavalink");
const { URLSearchParams } = require("url");
const { MongoClient } = require("mongodb");
const fetch = require("node-fetch");

class MusicClient extends Client {
  /**
   *
   * @param {String} token
   * @param {Array} nodes
   */
  constructor(token, nodes, mongodb_url) {
    super({});
    this.mongo = new MongoClient(mongodb_url, { useNewUrlParser: true });
    this.cacheReplys = new Collection();
    this.player;
    this.queue = [];
    this.volume = 15;
    this.repeat = false;

    this.on("ready", () => {
      console.log("Running:", this.user.tag);

      this.player = new PlayerManager(this, nodes, {
        user: this.user.id,
        shards: 0
      });

      this.setTimeout(async () => {
        var channel = this.channels
          .filter(c => c.type == "voice" && c.joinable)
          .filter(c => c.guild.me.displayName == c.name)
          .first();

        if (!channel) return console.log("client: no channel to join");

        var player = await this.player.join(
          {
            guild: channel.guild.id,
            channel: channel.id,
            host: this.player.nodes.first().host
          },
          { selfdeaf: true }
        );

        if (!player)
          return console.log("client: faild to connect with", channel.name);

        //player.volume(this.volume);
        player.on("error", console.error);
        player.on("end", reason => {
          if (reason == "REPLEACED") return;
          if (!this.queue[0]) return;

          if (this.repeat && reason != "SKIP") this.queue.push(this.queue[0]);

          this.queue.shift();

          if (this.queue[0]) return player.play(this.queue[0].track);
        });
      }, 2500);
    });

    this.on("error", console.error);
    this.on("warn", console.warn);

    this.login(token);
    this.mongo.connect(e =>
      e ? console.log("error: mongodb faild to connect -", e.message) : 0
    );
    return this;
  }

  /**
   *
   * @param {String} content
   */
  findSong(content) {
    const node = this.player.nodes.first();

    const params = new URLSearchParams();
    params.append("identifier", content.trim());

    return fetch(
      `http://${node.host}:${node.port}/loadtracks?${params.toString()}`,
      { headers: { Authorization: node.password } }
    )
      .then(r => r.json())
      .then(data => data.tracks)
      .catch(e => {
        console.error(e);
        return null;
      });
  }

  reset() {
    this.queue = [];
    this.volume = 15;
    this.repeat = false;
  }
}
module.exports = MusicClient;
