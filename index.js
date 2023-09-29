import TelegramBot  from "node-telegram-bot-api";
import {commandsHandler, eventsHandler} from "./handlers.js";
import "dotenv/config"
import { checkFileDB, getFavorites } from "./utils.js"

console.log("Расписание ИКТИБ запускается!");
const bot = new TelegramBot(process.env.token, {polling: true});


// Проверка файла с БД
await checkFileDB()
// Инициализация команд
await commandsHandler(bot);
// Инициализация ивентов
await eventsHandler(bot);