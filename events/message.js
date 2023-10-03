import {sendLog, getGroup, getTable, addUser, isFavorite} from "../utils.js";


export async function run (bot) {

    bot.on("message", async (msg) => {
        if (msg.text[0] !== '/') {
            await addUser(msg.chat.id)
            sendLog(`${msg.from.username}(${msg.from.id}): ${msg.text}`)
            
            await getGroup(msg.text.replace(".", ". ")).then(async result => {
                if (result?.buttons?.length > 0) {
                    await bot.sendMessage(msg.chat.id, "❗ По вашему поискову запросу не были найдены совпадения. Если ничего из ниже привидённого не является ожидаемым результатом, то введите точный поисковой запрос.", {
                        parse_mode: "Markdown",
                        reply_markup: {
                            resize_keyboard: true,
                            inline_keyboard: result.buttons
                        }
                    })
                } else {
                    getTable(result.group).then(async table => {
                        await isFavorite(msg.chat.id, result.name).then(async buttons => {
                            await bot.sendMessage(msg.chat.id, `*📚 Расписание - ${result.name} - ${table.week} неделя*\n\n`, {
                                parse_mode: "Markdown",
                                reply_markup: {
                                    resize_keyboard: true,
                                    inline_keyboard: buttons
                                }
                            })
                        })
                    })
                }

                    await bot.deleteMessage(msg.chat.id, msg.message_id)

            })
            .catch(async error => await bot.sendMessage(msg.chat.id, error, {reply_to_message_id: msg.message_id}))
        }
    })
}