import { addUser } from "./../utils.js";

export async function run (bot, msg) {
    
    await addUser(msg.chat.id)

    await bot.sendMessage(msg.chat.id, `👋 Добро пожаловать, ${msg.from.first_name}! Этот бот разработан для быстрого поиска расписания.\n\n` +
        "❗Для поика расписания необходимо отправить поисковой запрос. " +
        "Поисковой запрос может содержать номер аудитории, номер группы или фамилию преподавателя.\nПримечание, поисковой запрос нечувствителен к регистру!\n\n" +
        "Примеры поисковых запросов:\n" +
        " 🗄️ Д-404\n" +
        " 🧑‍💻 Романенко К. С.\n" +
        " 👥 КТбо2-13\n\n", {parse_mode: "Markdown"})
        
    await bot.deleteMessage(msg.chat.id, msg.message_id)
}
export async function description () {
    return "Входная точка"
}