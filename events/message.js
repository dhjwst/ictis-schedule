import {sendLog, getGroup, getTable} from "../utils.js";


export async function run (bot) {

    bot.onText(/^[А-Яа-я0-9\.\-]/, async (msg) => {
        await sendLog(`${msg.from.username}(${msg.from.id}): ${msg.text}`)
        switch (msg.text) {
            case "Полезные ссылки":
                const opts = {
                    parse_mode: "Markdown",
                    reply_markup: {
                        resize_keyboard: true,
                        inline_keyboard: [
                            [{text: "Связь с разработчиком", url: "https://t.me/dhjwst"}],
                            [{text: "Cайт ИКТИБ", url: "https://ictis.sfedu.ru"}],
                            [{text: "Cайт ЮФУ", url: "https://sfedu.ru"}],
                            [{text: "Бонусы для студентов", url: "https://ictis.ru/free"}],
                            [{text: "Сайт с расписанием", url: "https://ictis.ru"}],
                            [{text: "Расписание для Android", url: "https://t.me/ictis_raspisanie"}],
                        ],
                    }
                };
                await bot.sendMessage(msg.chat.id, "*Расписание - Полезные ссылки*", opts)
                await bot.deleteMessage(msg.chat.id, msg.message_id)
                break
            case "Избранное":
                await bot.sendMessage(msg.chat.id, "Скоро!", {parse_mode: "Markdown", reply_to_message_id: msg.message_id})
                break
            default:

                await getGroup(msg.text.replace(".", ". "))
                .then(async group => {
                    const opts = {
                        parse_mode: "Markdown",
                        reply_markup: {
                            resize_keyboard: true,
                            inline_keyboard: [
                                [{text: "Выбрать день", callback_data: "select_day"}, {text: "Выбрать неделю", callback_data: "select_week"}],
                                [{text: "Синхронизация с календарём", callback_data: "sync_calendar"}],
                                [{text: "Добавить в избранное", callback_data: "add_to_favorite"}]
                            ],
                        }
                    };
                    getTable(group.group).then(async table => {
                        await bot.sendMessage(msg.chat.id, `*Расписание - ${group.name} - ${table.week} неделя*\n\n`, opts)
                        await bot.deleteMessage(msg.chat.id, msg.message_id)
                    })
                })
                .catch(async error => await bot.sendMessage(msg.chat.id, error, {reply_to_message_id: msg.message_id}))
                break
        }
    })
}