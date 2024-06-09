import { getStats } from "./../utils.js";


export async function run (bot, msg, args) {
    getStats(msg.chat.id).then(async stats => {
        await bot.sendMessage(msg.chat.id, `📄 *Статистика*\n\n🫵 Ваша статистика\nВы запросили расписаний: ${stats.schedulesReceived}\nРасписаний в избранном: ${stats.favorites}\n\n🤖Статистика бота\nОбработано сообщений: ${msg.message_id}\nВсего запросили расписаний: ${stats.schedulesReceivedTotal}\nПользователей: ${stats.users}`, {parse_mode: "Markdown"});
        await bot.deleteMessage(msg.chat.id, msg.message_id)
    })
}

export async function description () {
    return "Статистика"
}