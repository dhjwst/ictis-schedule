import {getGroup, getTable, getSchedule, sendLog, addFavorite, removeFavorite, isFavorite} from "../utils.js";


export async function run (bot) {
    bot.on("callback_query", async (query) => {
        if ( query.data === "remove_message") return await bot.deleteMessage(query.message.chat.id, query.message.message_id);
        getGroup(query.message.text.split("\n")[0].split(" - ")[1] !== undefined ? query.message.text.split("\n")[0].split(" - ")[1] : query.data.replace(".", ". ").replace('  ', ' ')).then(async result => {
            switch(query.data) {
                // Главное меню
                case "main":
                    getTable(result.group).then(async () => {
                        await isFavorite(query.message.chat.id, result.name).then(async buttons => {
                            await bot.editMessageText(`*📚 Расписание - ${result.name} - ${query.message.text.split('\n\n')[0].split(' - ')[2].split(' ')[0]} неделя*\n\nВыберите нужную вам функцию`, {
                                chat_id: query.message.chat.id,
                                message_id: query.message.message_id,
                                parse_mode: "Markdown",
                                reply_markup: {
                                    resize_keyboard: true,
                                    inline_keyboard: buttons
                                }
                            })
                        })
                    })
                    break;
                // Удаление сообщения
                case "remove_message":
                    break;
                // Выбор дня недели
                case "select_day":
                    await getTable(result.group).then(async table => {
                        await bot.editMessageText(`*📚 Расписание - ${table.name} - ${query.message.text.split('\n\n')[0].split(' - ')[2].split(' ')[0]} неделя*\n\nВыберите нужный вам день недели`, {
                                chat_id: query.message.chat.id,
                                message_id: query.message.message_id,
                                parse_mode: "Markdown",
                                reply_markup: {
                                    resize_keyboard: true,
                                    inline_keyboard: [
                                        [{text: "Понедельник", callback_data: "d0"}, {text: "Вторник", callback_data: "d1"}, {text: "Среда", callback_data: "d2"}],
                                        [{text: "Четверг", callback_data: "d3"}, {text: "Пятница", callback_data: "d4"}, {text: "Суббота", callback_data: "d5"}],
                                        [{text: "Вся неделя", callback_data: "d6"}],
                                        [{text: "Выбрать неделю", callback_data: "select_week"}],
                                        [{text: "Назад", callback_data: "main"}]
                                    ]
                                }
                            })
                        })
                    break;
                case query.data.match(/^d[0-6]/)?.input:
                    sendLog(`${query.from.username}(${query.from.id}): Выбрал(а) новый день для расписания(${result.name}/${query.data})`)
                    getSchedule(result.group, parseInt(query.data.replace('d', '')), query.from.id, query.message.text.split('\n\n')[0].split(' - ')[2].split(' ')[0]).then(async schedule => {
                        if (query.message.text !== schedule) {
                            await bot.editMessageText(schedule, {
                                chat_id: query.message.chat.id,
                                message_id: query.message.message_id,
                                parse_mode: "Markdown"})
                            await bot.editMessageReplyMarkup({                                    
                                resize_keyboard: true,
                                inline_keyboard: [
                                    [{text: "Понедельник", callback_data: "d0"}, {text: "Вторник", callback_data: "d1"}, {text: "Среда", callback_data: "d2"}],
                                    [{text: "Четверг", callback_data: "d3"}, {text: "Пятница", callback_data: "d4"}, {text: "Суббота", callback_data: "d5"}],
                                    [{text: "Вся неделя", callback_data: "d6"}],
                                    [{text: "Выбрать неделю", callback_data: "select_week"}],
                                    [{text: "Назад", callback_data: "main"}]
                                ]}, {
                                    chat_id: query.message.chat.id,
                                    message_id: query.message.message_id,
                                })
                            }
                        }) 
                    break;
                // Выбор недели
                case "select_week":
                    await getTable(result.group).then(async table => {
                        let weeks = [[]]
                        let i = 0;
                        let temp = 0;
                        table.weeks.forEach(week => {
                            if (i % 4 === 0) {
                                temp++
                                weeks.push([])
                            }
                            weeks[temp].push({text: week, callback_data: "w" + week})
                            i++
                        });
                        weeks.push([{text: "Назад", callback_data: "main"}])
                        await bot.editMessageText(`*📚 Расписание - ${table.name} - ${query.message.text.split('\n\n')[0].split(' - ')[2].split(' ')[0]} неделя*\n\nВыберите нужную вам неделю`, {
                            chat_id: query.message.chat.id,
                            message_id: query.message.message_id,
                            parse_mode: "Markdown",
                            reply_markup: {
                                resize_keyboard: true,
                                inline_keyboard: weeks
                            }
                        })
                    })
                    .catch(error => console.log)
                    break;
                case query.data.match(/^w[0-9]/)?.input:
                    sendLog(`${query.from.username}(${query.from.id}): Выбрал(а) новую неделю для расписания(${result.name}/${query.data})`)
                    
                    await bot.editMessageText(`*📚 Расписание - ${result.name} - ${query.data.replace('w', '')} неделя*\n\nВыберите нужный вам день недели`, {
                        chat_id: query.message.chat.id,
                        message_id: query.message.message_id,
                        parse_mode: "Markdown",
                        reply_markup: {
                            resize_keyboard: true,
                            inline_keyboard: [
                                [{text: "Понедельник", callback_data: "d0"}, {text: "Вторник", callback_data: "d1"}, {text: "Среда", callback_data: "d2"}],
                                [{text: "Четверг", callback_data: "d3"}, {text: "Пятница", callback_data: "d4"}, {text: "Суббота", callback_data: "d5"}],
                                [{text: "Вся неделя", callback_data: "d6"}],
                                [{text: "Назад", callback_data: "main"}]
                            ]
                        }
                    })
                    break;
                // Избранные
                case "add_to_favorite":
                    await addFavorite(query.message.chat.id, result.name).then(async () => {
                        bot.editMessageReplyMarkup({                                    
                            resize_keyboard: true,
                            inline_keyboard: [
                                [{text: "Выбрать день", callback_data: "select_day"}, {text: "Выбрать неделю", callback_data: "select_week"}],
                                [{text: "Удалить из избранного", callback_data: "remove_favorite"}]
                            ]}, {
                                chat_id: query.message.chat.id,
                                message_id: query.message.message_id,
                            })
                        })
                    break;
                case"remove_favorite":
                    await removeFavorite(query.message.chat.id, result.name).then(async () => {
                        bot.editMessageReplyMarkup({                                    
                            resize_keyboard: true,
                            inline_keyboard: [
                                [{text: "Выбрать день", callback_data: "select_day"}, {text: "Выбрать неделю", callback_data: "select_week"}],
                                [{text: "Добавить в избранное", callback_data: "add_to_favorite"}]
                            ]}, {
                                chat_id: query.message.chat.id,
                                message_id: query.message.message_id,
                            })
                        })
                        break;
                // Выбор группы из избранного
                case query.data.match(/^[а-яА-Я0-9\/\.]/)?.input:
                    sendLog(`${query.from.username}(${query.from.id}): Выбрал(а) расписание из избранного (${query.data})`)
                    
                    await getGroup(query.data).then(async result => {
                        await getTable(result.group).then(async table => {
                            await isFavorite(query.message.chat.id, result.name).then(async buttons => {
                                await bot.editMessageText(`*📚 Расписание - ${result.name} - ${table.week} неделя*\n\n`, {
                                    chat_id: query.message.chat.id,
                                    message_id: query.message.message_id,
                                    parse_mode: "Markdown",
                                    reply_markup: {
                                        resize_keyboard: true,
                                        inline_keyboard: buttons
                                    }
                                })
                            })
                        })
                    })
                    break;
            }
        }) 
    })
}