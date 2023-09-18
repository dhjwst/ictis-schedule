import {readdirSync} from "fs"

export async function commandsHandler(bot) {

    console.log("Загрузка команд...")

    let commands = []

    const commandNames = readdirSync("./commands");

    for(const commandName of commandNames) {
        const cmd = await import("./commands/" + commandName)
        commands.push({command: commandName.split(".")[0], description: `${await cmd.description()}`})
        const regexp = new RegExp(`/${commandName.split(".")[0]}`);
        bot.onText(regexp, async (msg) => {
            let args = msg.text.split(" ");
            args.splice(0, 1);
            cmd.run(bot, msg, args)
        })
    }
    // commands
    await bot.setMyCommands(commands)

    console.log(`Загружено команд: ${commandNames.length} (${commandNames})`);
}

export async function eventsHandler(bot) {
    console.log("Загрузка ивентов...")

    const eventNames = readdirSync("./events");

    for(const eventName of eventNames) {
        (await import("./events/" + eventName)).run(bot)
    }

    console.log(`Загружено ивентов: ${eventNames.length} (${eventNames})`);
}
