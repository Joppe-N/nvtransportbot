const discord = require("discord.js");
const botConfig = require("./botconfig.json");
const os = require('os');
const moment = require('moment');
const ms = require('ms');

const fs = require("fs");

const bot = new discord.Client();
bot.commands = new discord.Collection();

fs.readdir("./commands", (err, files) => {

    if(err) console.log(err);

    var jsFiles = files.filter(f => f.split(".").pop() === "js");

    if(jsFiles.length <=0) {
        console.log("Kon geen files vinden in de map commands");
        return;
    }

    jsFiles.forEach((f,i) => {

        var fileGet = require(`./commands/${f}`);
        console.log(`de file ${f} is ingeladen`)

        bot.commands.set(fileGet.help.name, fileGet);

    })

});
const Client  = new discord.Client();
bot.login(process.env.token);

bot.on("ready", async () => {

    console.log(`${bot.user.username} is online`);
    bot.user.setActivity(`${bot.guilds.cache.size} servers`, {type: "WATCHING"});

});

bot.on("guildMemberAdd", member => {

    var role = member.guild.roles.cache.get('630264754627280916');

    if(!role) return;

    member.roles.add(role);

    var channel = member.guild.channels.cache.get('630264087959568442');

    if(!channel) return;

    var joinEmbed = new discord.MessageEmbed()
    .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL)
    .setDescription(`dat is fijn dat je gejoind bent ${member.user.username},`)
    .setColor("#FF0000")
    .setFooter("gebruiker gejoind")
    .setTimestamp()

    channel.send(joinEmbed);
});

bot.on("guildMemberRemove" , member => {

    var channel = member.guild.channels.cache.get('630264087959568442');

    if(!channel) return;
   
   var leaveEmbed = new discord.MessageEmbed()
       .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL)
       .setDescription(`dat is jammer hopen dat je nog terug komt ${member.user.username},`)
       .setColor("#FF0000")
       .setFooter("gebruiker geleave")
       .setTimestamp()
   
       channel.send(leaveEmbed);
});
bot.on("message", async message =>{

    if(message.author.bot) return;

    if(message.channel.type == "dm") return;

    var prefix = botConfig.prefix;

    var messageArray = message.content.split(" ")

    var command = messageArray[0];

    if(!message.content.startsWith(prefix)) return;
 
 
    // command handler

    var arguments = messageArray.slice(1);


    var commands = bot.commands.get(command.slice(prefix.length));

    if(commands) commands.run(bot,message, arguments)
});