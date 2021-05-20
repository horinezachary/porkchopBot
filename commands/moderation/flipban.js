const Command = require(`${process.cwd()}/base/Command.js`);
const Discord = require("discord.js");

class flipban extends Command {
  constructor(client) {
    super(client, {
      name: "flipban",
      description: "Warns or Bans a user from the server by mention/id, dependent on a coin flip.",
      usage: "flipban <user> <reason>",
      aliases: ["fb"],
      permRequired: "BAN_MEMBERS"
    });
  }

  async run(bot, msg, args, level) {
    let reason = "";
    let reasonStart = false;
    let user_id = "";
    for (let arg of args) {
      if (reasonStart) {
        reason += arg + " ";
      }
      if (arg && arg.match(/([0-9]{18})/g)) { //is a user id or an id in general
        console.log(arg.match(/([0-9]{18})/g));
        let argUser = await msg.guild.members.cache.get(arg.match(/([0-9]{18})/g)[0]);
        if (argUser != undefined && user_id == "") {
          user_id = argUser.id;
          reasonStart = true;
        }
      }
    }
    reason = reason.trim();
    if (user_id != "") {
      //do flip
      var i = Math.floor(Math.random() * 2);
      if (i == 0) { //heads (warn)
        msg.reply(new Discord.MessageEmbed()
          .setAuthor("Flip Ban: Heads! (Warn)", bot.user.avatarURL())
          .setColor(bot.config.DEFAULT_EMBED_COLOR)
          .setFooter(msg.author.username, msg.author.avatarURL())
          .setTimestamp()
          .setDescription(`User:<@${user_id}> (${user_id})\n`+
                          `Moderator: <@${msg.author.id}>\n`+
                          "Reason: ```"+reason+"```"));
      }
      if (i == 1) { //tails (ban)
        let options = {reason: reason};
        let result = false;
        msg.guild.members.ban(user_id,options).then(
          msg.reply(new Discord.MessageEmbed()
            .setAuthor("Flip Ban: Tails! (Ban)", bot.user.avatarURL())
            .setColor(bot.config.DEFAULT_EMBED_COLOR)
            .setFooter(msg.author.username, msg.author.avatarURL())
            .setTimestamp()
            .setDescription(`User:<@${user_id}> (${user_id})\n`+
                            `Moderator: <@${msg.author.id}>\n`+
                            "Reason: ```"+reason+"```")));
      }
    } else {
      //fuck
    }
  }
}

module.exports = flipban;
