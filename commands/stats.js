import { getStats } from "./../utils.js";


export async function run (bot, msg, args) {
    getStats(msg.chat.id).then(async stats => {
        await bot.sendMessage(msg.chat.id, `📄 *Статистика*\n\nВаша статистика\nВы запросили рассписаний: ${stats.schedulesReceived}\nРасписаний в избранном: ${stats.favorites}\n\nСтатистика бота\nВсего запросили расписаний: ${stats.schedulesReceivedTotal}\nПользователей: ${stats.users}`);
        await bot.deleteMessage(msg.chat.id, msg.message_id)
    })
}

export async function description () {
    return "Статистика"
}