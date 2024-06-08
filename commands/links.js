export async function run (bot, msg, args) {

    await bot.sendMessage(msg.chat.id, "🔗 Полезные ссылки для студентов", {
        parse_mode: "Markdown",
        reply_markup: {
            resize_keyboard: true,
            inline_keyboard: [
                [{text: "Связь с разработчиком", url: "https://t.me/dhjwst"}],
                [{text: "Cайт ИКТИБ", url: "https://ictis.sfedu.ru"}],
                [{text: "Cайт ЮФУ", url: "https://sfedu.ru"}],
                [{text: "Сайт с расписанием", url: "https://ictis.ru"}],
                [{text: "Бонусы для студентов", url: "https://ictis.ru/free"}],
                [{text: "sfedu hub", url: "https://sfeduhub.ru"}],
                [{text: "Исходный код", url: "https://github.com/dhjwst/ictis-schedule"}]
            ],
        }
    })
    await bot.deleteMessage(msg.chat.id, msg.message_id)

}
export async function description () {
    return "Полезные ссылки"
}