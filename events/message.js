import {sendLog, getGroup, getTable, addUser, isFavorite} from "../utils.js";


export async function run (bot) {

    bot.on("message", async (msg) => {
        if (msg.text[0] !== '/') {
            addUser(msg.chat.id)

            sendLog(`${msg.from.username}(${msg.from.id}): ${msg.text}`)
            
            getGroup(msg.text.replace(".", ". ")).then(async group => {
                getTable(group.group).then(async table => {
                    let board = []
                    isFavorite(msg.chat.id, group.name).then(async flag => {
                        
                        if (flag) {
                            board = [
                                [{text: "Выбрать день", callback_data: "select_day"}, {text: "Выбрать неделю", callback_data: "select_week"}],
                                [{text: "Удалить из избранного", callback_data: "remove_favorite"}]
                            ]
                        } else {
                            board = [
                                [{text: "Выбрать день", callback_data: "select_day"}, {text: "Выбрать неделю", callback_data: "select_week"}],
                                [{text: "Добавить в избранное", callback_data: "add_to_favorite"}]
                            ]
                        }
                        const opts = {
                            parse_mode: "Markdown",
                            reply_markup: {
                                resize_keyboard: true,
                                inline_keyboard: board
                            }
                        };
                        await bot.sendMessage(msg.chat.id, `*📚 Расписание - ${group.name} - ${table.week} неделя*\n\n`, opts)
                        await bot.deleteMessage(msg.chat.id, msg.message_id)
                })
            })
        })
            .catch(async error => await bot.sendMessage(msg.chat.id, error, {reply_to_message_id: msg.message_id}))
        }
    })
}