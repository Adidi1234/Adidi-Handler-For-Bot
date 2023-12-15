const {Client,GatewayIntentBits,Collection}=require("discord.js");
const fs=require("fs");
const betterchalk=require("better-chalk");
const config=require("./config");
const client=new Client({
    intents: Object.keys(GatewayIntentBits)
});
client.prefixcommands = new Collection();
client.slashcommands = new Collection();
const prefixfiles=fs.readdirSync("./prefixs").filter(f=>f.endsWith(".js"));
const slashfiles=fs.readdirSync("./slashs").filter(f=>f.endsWith(".js"));
const eventFiles = fs.readdirSync("./events").filter((f) => f.endsWith(".js"));
for(const file of prefixfiles){
    const command=require(`./prefixs/${file}`);
    client.prefixcommands.set(command.name,command);
};
for(const file of slashfiles){
    const command=require(`./slashs/${file}`);
    client.slashcommands.set(command.data.name,command);
};
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }
client.login(config.token);
process.on("uncaughtExceptionRejection",(err)=>{
  console.error(err);
  if(client){
    client.destroy()
    .then(()=>client.login(config.token))
    .catch(relogin=>console.error(relogin))
  }else{
    process.exit(1);
  }
});
client.on("error",async(err)=>{
  console.error(err);
});
client.on("disconnect",async(event)=>{
  console.log(`Disconnected: ${event.reason} ${event.code}`)
});