import TelegramBot  from "node-telegram-bot-api";
import {commandsHandler, eventsHandler} from "./handlers.js";
import "dotenv/config"

console.log("Расписание ИКТИБ запускается!");
const bot = new TelegramBot(process.env.token, {polling: true});

// Инициализация команд
await commandsHandler(bot);
// Инициализация ивентов
await eventsHandler(bot);