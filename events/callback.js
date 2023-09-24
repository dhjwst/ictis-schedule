import {getGroup, getTable, getSchedule, sendLog} from "../utils.js";


export async function run (bot) {
    bot.on("callback_query", (query) => {
        getGroup(query.message.text.split("\n")[0].split(" - ")[1]).then(async result => {
            switch(query.data) {
                case "main":
                    getTable(result.group).then(async table => {
                        await bot.editMessageText(`*Расписание - ${result.name} - ${query.message.text.split('\n\n')[0].split(' - ')[2].split(' ')[0]} неделя*\n\n`, {
                            chat_id: query.message.chat.id,
                            message_id: query.message.message_id,
                            parse_mode: "Markdown",
                            reply_markup: {
                                resize_keyboard: true,
                                inline_keyboard: [
                                    [{text: "Выбрать день", callback_data: "select_day"}, {text: "Выбрать неделю", callback_data: "select_week"}],
                                    [{text: "Добавить в избранное", callback_data: "add_to_favorite"}]
                                ]
                            }
                        })
                    })
                    break;
                    // Выбор дня недели
                    case "select_day":
                        await getTable(result.group)
                            .then(async table => {
                                await bot.editMessageText(`*Расписание - ${table.name} - ${query.message.text.split('\n\n')[0].split(' - ')[2].split(' ')[0]} неделя*\n\nВыберите нужный вам день недели`, {
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
                            })
                        break;
                    case query.data.match(/d[0-6]/)?.input:
                        await sendLog(`${query.from.username}(${query.from.id}): Выбрал(а) новый день для расписания(${result.name}/${query.data})`)
                        getSchedule(result.group, parseInt(query.data.replace('d', '')), query.message.text.split('\n\n')[0].split(' - ')[2].split(' ')[0]).then(async schedule => {
                            if (query.message.text !== schedule) {
                                await bot.editMessageText(schedule, {
                                    chat_id: query.message.chat.id,
                                    message_id: query.message.message_id,
                                    parse_mode: "Markdown",

                                })
                                bot.editMessageReplyMarkup({                                    resize_keyboard: true,
                                    inline_keyboard: [
                                        [{text: "Понедельник", callback_data: "d0"}, {text: "Вторник", callback_data: "d1"}, {text: "Среда", callback_data: "d2"}],
                                        [{text: "Четверг", callback_data: "d3"}, {text: "Пятница", callback_data: "d4"}, {text: "Суббота", callback_data: "d5"}],
                                        [{text: "Вся неделя", callback_data: "d6"}],
                                        [{text: "Назад", callback_data: "main"}]
                                    ]}, {
                                        chat_id: query.message.chat.id,
                                        message_id: query.message.message_id,
                                    }

                                )
                            }

                        }) 
                        break;
                    // Выбор недели
                    case "select_week":
                        await getTable(result.group)
                            .then(async table => {
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
                                await bot.editMessageText(`*Расписание - ${table.name} - ${query.message.text.split('\n\n')[0].split(' - ')[2].split(' ')[0]} неделя*\n\nВыберите нужную вам неделю`, {
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
                case query.data.match(/w[0-9]/)?.input:
                    await sendLog(`${query.from.username}(${query.from.id}): Выбрал(а) новую неделю для расписания(${result.name}/${query.data})`)
                    await bot.editMessageText(`*Расписание - ${result.name} - ${query.data.replace('w', '')} неделя*\n\nВыберите нужный вам день недели`, {
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

            }
        }) 
    })
}