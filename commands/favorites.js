import { getFavorites } from "../utils.js";

export async function run (bot, msg) {
    getFavorites(msg.chat.id).then(async favoritesList => {
        if (favoritesList.length === 0) await bot.sendMessage(msg.chat.id, "🚫 У вас нет сохранённых расписаний! Вы можете добавить их нажав на кнопку \"Добавить в избранное\" при просмотре расписания", {parse_mode: "Markdown"})
        else {
            let favorites = [[]]
            let i = 0;
            let temp = 0;
            favoritesList.forEach(favorite => {
                if (i % 4 === 0) {
                    temp++
                    favorites.push([])
                }
                favorites[temp].push({text: favorite, callback_data: favorite})
                i++
            });

            await bot.sendMessage(msg.chat.id, "📄 Выберите сохранённое расписание", {
                parse_mode: "Markdown",
                reply_markup: {
                    resize_keyboard: true,
                    inline_keyboard: favorites,
                }
            })                    
        }
        await bot.deleteMessage(msg.chat.id, msg.message_id)
    })

}
export async function description () {
    return "Сохранённые расписания"
}