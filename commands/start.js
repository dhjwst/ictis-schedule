export async function run (bot, msg, args) {
    const opts = {
        parse_mode: "Markdown",
        reply_markup: {
            resize_keyboard: true,
            keyboard: [
                ["Избранное", "Полезные ссылки", ],
            ],
        }
    };

    await bot.sendMessage(msg.chat.id, "*Расписание*\n\nДобро пожаловать! Этот бот разработан для быстрого поиска расписания.\n\n" +
        "Для поика расписания необходимо отправить поисковой запрос. " +
        "Поисковой запрос может содержать *номер аудитории*, *номер группы* или *фамилию преподавателя*.\nПримечание, поисковой запрос нечувствителен к регистру!\n\n" +
        "Примеры:\n" +
        " 1) *Д-404* (кабинет)\n" +
        " 2) *Романенко К. С.* (преподаватель)\n" +
        " 3) *КТбо1-1* (группа)\n\n", opts)
    await bot.deleteMessage(msg.chat.id, msg.message_id)
}
export async function description () {
    return "Входная точка"
}