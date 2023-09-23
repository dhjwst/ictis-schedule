import {getGroup, getTable, getSchedule} from "../utils.js";


export async function run (bot) {
    bot.on("callback_query", (query) => {
        getGroup(query.message.text.split("\n")[0].split(" - ")[1]).then(async result => {
            
            switch(query.data) {
                // case "select_day":
                //     await getTable(result.group)
                //         .then(async table => {
                //             await bot.editMessageText(`*Расписание - ${table.name} - ${query.message.text.split('\n\n')[0].split(' - ')[2].split(' ')[0]} неделя*\n\nВыберите нужный вам день недели`, {
                //                 chat_id: query.message.chat.id,
                //                 message_id: query.message.message_id,
                //                 parse_mode: "Markdown",
                //                 reply_markup: {
                //                     resize_keyboard: true,
                //                     inline_keyboard: [
                //                         [{text: "Понедельник", callback_data: "monday"}, {text: "Вторник", callback_data: "tuesday"}, {text: "Среда", callback_data: "wednesday"}],
                //                         [{text: "Четверг", callback_data: "thursday"}, {text: "Пятница", callback_data: "friday"}, {text: "Суббота", callback_data: "saturday"}],
                //                         [{text: "Вся неделя", callback_data: "all_days"}],
                //                         [{text: "Назад", callback_data: "main"}]
                //                     ]
                //                 }
                //             })
                //         })
                //     break;
                case "select_week":
                    await getTable(result.group)
                        .then(async table => {
                            let d = 0;
                            for (let i = table.weeks.length-1; i > 0; i--) {
                                if (table.weeks.length % i === 0) {
                                    d = i
                                    break;
                                }
                            }
                            
                            let weeks = [[]]
                            let i = 0;
                            let temp = 0;
                            table.weeks.forEach(week => {
                                console.log(week)
                                if (i % d === 0) {
                                    temp++
                                    weeks.push([])
                                }
                                weeks[temp].push({text: week, callback_data: "w" + week})
                                i++
                            });

                            weeks.push([{text: "Назад", callback_data: "main"}])
                            //console.log(weeks)
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
                // case "monday":
                //     getSchedule(result.group, 0, query.message.text.split('\n\n')[0].split(' - ')[2].split(' ')[0]).then(async schedule => {
                //         await bot.editMessageText(schedule, {

                //             chat_id: query.message.chat.id,
                //             message_id: query.message.message_id,
                //             parse_mode: "Markdown",
                //             reply_markup: {
                //                 resize_keyboard: true,
                //                 inline_keyboard: [
                //                     [{text: "Вторник", callback_data: "tuesday"}, {text: "Среда",callback_data: "wednesday"}],
                //                     [{text: "Четверг", callback_data: "thursday"}, {text: "Пятница",callback_data: "friday"}, {text: "Суббота", callback_data: "saturday"}],
                //                     [{text: "Вся неделя", callback_data: "all_days"}],
                //                     [{text: "Назад", callback_data: "main"}]
                //                 ]
                //             }
                //         })
                //     })
                //     break;
                // case "tuesday":

                //     getSchedule(result.group, 1, query.message.text.split('\n\n')[0].split(' - ')[2].split(' ')[0]).then(async schedule => {
                //         await bot.editMessageText(schedule, {
                //             chat_id: query.message.chat.id,
                //             message_id: query.message.message_id,
                //             parse_mode: "Markdown",
                //             reply_markup: {
                //                 resize_keyboard: true,
                //                 inline_keyboard: [
                //                     [{text: "Понедельник", callback_data: "monday"}, {text: "Среда",callback_data: "wednesday"}],
                //                     [{text: "Четверг", callback_data: "thursday"}, {text: "Пятница", callback_data: "friday"}, {text: "Суббота", callback_data: "saturday"}],
                //                     [{text: "Вся неделя", callback_data: "all_days"}],
                //                     [{text: "Назад", callback_data: "main"}]
                //                 ]
                //             }
                //         })
                //     })
                //     break;
                // case "wednesday":
                //     getSchedule(result.group, 2, query.message.text.split('\n\n')[0].split(' - ')[2].split(' ')[0]).then(async schedule => {
                //         await bot.editMessageText(schedule, {
                //             chat_id: query.message.chat.id,
                //             message_id: query.message.message_id,
                //             parse_mode: "Markdown",
                //             reply_markup: {
                //                 resize_keyboard: true,
                //                 inline_keyboard: [
                //                     [{text: "Понедельник", callback_data: "monday"}, {text: "Вторник",callback_data: "tuesday"}],
                //                     [{text: "Четверг", callback_data: "thursday"}, {text: "Пятница", callback_data: "friday"}, {text: "Суббота", callback_data: "saturday"}],
                //                     [{text: "Вся неделя", callback_data: "all_days"}],
                //                     [{text: "Назад", callback_data: "main"}]
                //                 ]
                //             }
                //         })
                //     })
                //     break;
                // case "thursday":
                //     getSchedule(result.group, 3, query.message.text.split('\n\n')[0].split(' - ')[2].split(' ')[0]).then(async schedule => {
                //         await bot.editMessageText(schedule, {
                //             chat_id: query.message.chat.id,
                //             message_id: query.message.message_id,
                //             parse_mode: "Markdown",
                //             reply_markup: {
                //                 resize_keyboard: true,
                //                 inline_keyboard: [
                //                     [{text: "Понедельник", callback_data: "monday"}, {text: "Вторник", callback_data: "tuesday"}, {text: "Среда", callback_data: "wednesday"}],
                //                     [{text: "Пятница", callback_data: "friday"}, {text: "Суббота",callback_data: "saturday"}],
                //                     [{text: "Вся неделя", callback_data: "all_days"}],
                //                     [{text: "Назад", callback_data: "main"}]
                //                 ]
                //             }
                //         })
                //     })
                //     break;
                // case "friday":
                //     getSchedule(result.group, 4, query.message.text.split('\n\n')[0].split(' - ')[2].split(' ')[0]).then(async schedule => {
                //         await bot.editMessageText(schedule, {
                //             chat_id: query.message.chat.id,
                //             message_id: query.message.message_id,
                //             parse_mode: "Markdown",
                //             reply_markup: {
                //                 resize_keyboard: true,
                //                 inline_keyboard: [
                //                     [{text: "Понедельник", callback_data: "monday"}, {text: "Вторник",callback_data: "tuesday"}, {text: "Среда", callback_data: "wednesday"}],
                //                     [{text: "Четверг", callback_data: "thursday"}, {text: "Суббота",callback_data: "saturday"}],
                //                     [{text: "Вся неделя", callback_data: "all_days"}],
                //                     [{text: "Назад", callback_data: "main"}]
                //                 ]
                //             }
                //         })
                //     })
                //     break;
                // case "saturday":
                //     getSchedule(result.group, 5, query.message.text.split('\n\n')[0].split(' - ')[2].split(' ')[0]).then(async schedule => {
                //         await bot.editMessageText(schedule, {
                //             chat_id: query.message.chat.id,
                //             message_id: query.message.message_id,
                //             parse_mode: "Markdown",
                //             reply_markup: {
                //                 resize_keyboard: true,
                //                 inline_keyboard: [
                //                     [{text: "Понедельник", callback_data: "monday"}, {text: "Вторник",callback_data: "tuesday"}, {text: "Среда", callback_data: "wednesday"}],
                //                     [{text: "Четверг", callback_data: "thursday"}, {text: "Пятница",callback_data: "friday"}],
                //                     [{text: "Вся неделя", callback_data: "all_days"}],
                //                     [{text: "Назад", callback_data: "main"}]
                //                 ]
                //             }
                //         })
                //     })
                //     break;
                // case "all_days":
                //     getSchedule(result.group, 6, query.message.text.split('\n\n')[0].split(' - ')[2].split(' ')[0]).then(async schedule => {
                //         await bot.editMessageText(schedule, {
                //             chat_id: query.message.chat.id,
                //             message_id: query.message.message_id,
                //             parse_mode: "Markdown",
                //             reply_markup: {
                //                 resize_keyboard: true,
                //                 inline_keyboard: [
                //                     [{text: "Понедельник", callback_data: "monday"}, {text: "Вторник",callback_data: "tuesday"}, {text: "Среда", callback_data: "wednesday"}],
                //                     [{text: "Четверг", callback_data: "thursday"}, {text: "Пятница",callback_data: "friday"}, {text: "Суббота", callback_data: "saturday"}],
                //                     [{text: "Назад", callback_data: "main"}]
                //                 ]
                //             }
                //         })
                //     })
                //     break;






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
                        getSchedule(result.group, parseInt(query.data.replace('d', '')), query.message.text.split('\n\n')[0].split(' - ')[2].split(' ')[0]).then(async schedule => {
                            await bot.editMessageText(schedule, {
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
                        console.log(query.data.replace('d', ''))
                        break;
                    // getSchedule(result.group, query.data.replace('d', ''), query.message.text.split('\n\n')[0].split(' - ')[2].split(' ')[0]).then(async schedule => {
                        //     await bot.editMessageText(schedule, {
                        //         chat_id: query.message.chat.id,
                        //         message_id: query.message.message_id,
                        //         parse_mode: "Markdown",
                        //         reply_markup: {
                        //             resize_keyboard: true,
                        //             inline_keyboard: [
                        //                 [{text: "Понедельник", callback_data: "monday"}, {text: "Вторник",callback_data: "tuesday"}, {text: "Среда", callback_data: "wednesday"}],
                        //                 [{text: "Четверг", callback_data: "thursday"}, {text: "Пятница",callback_data: "friday"}, {text: "Суббота", callback_data: "saturday"}],
                        //                 [{text: "Назад", callback_data: "main"}]
                        //             ]
                        //         }
                        //     })
                        // })
                        // break;    
                case query.data.match(/w[0-9]/)?.input:
                    await bot.editMessageText(`*Расписание - ${result.name} - ${query.data.replace('w', '')} неделя*\n\nВыберите нужный вам день недели`, {
                        chat_id: query.message.chat.id,
                        message_id: query.message.message_id,
                        parse_mode: "Markdown",
                        reply_markup: {
                            resize_keyboard: true,
                            inline_keyboard: [
                                [{text: "Понедельник", callback_data: "monday"}, {text: "Вторник", callback_data: "tuesday"}, {text: "Среда", callback_data: "wednesday"}],
                                [{text: "Четверг", callback_data: "thursday"}, {text: "Пятница", callback_data: "friday"}, {text: "Суббота", callback_data: "saturday"}],
                                [{text: "Вся неделя", callback_data: "all_days"}],
                                [{text: "Назад", callback_data: "main"}]
                            ]
                        }
                    })
                    break;

            }
        }) 
    })
}