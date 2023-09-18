import axios from "axios";

// Возвращает номер группы
export async function getGroup(query) {
    return new Promise(async (res, rej) => {
        // получаем id
        await axios.get("https://webictis.sfedu.ru/schedule-api/?query=" + query)
            .then(async resp => {
            // Если при запросе найдено больше одного id
            if (resp.data?.choices?.length >= 2)
                for (let i = 0; i < resp.data?.choices.length; i++) {
                    if (resp.data?.choices[i]?.name.toLowerCase() === query.toLowerCase()) res({group: resp.data?.choices[i].group, name: resp.data?.choices[i].name});
                }
            // Если найден 1 id
            else if (resp.data.result !== "no_entries") res({group: resp.data.table.group, name: resp.data.table.name});
            // Если id не найден
            else rej("По указаному запросу ничего не было найдено");
            })
            .catch(async error => rej("Не удалось отправить запрос на сервер ИКТИБа. Возможно он временно недоступен, попробуйте отправить запрос позже."))
    });
}

// Получаем таблицу из сайта https://webictis.sfedu.ru через API, после сохраняем её и возвращаем
export async function getTable(group, week=-1) {
    return new Promise(async (res) => {
        await axios.get(week === -1 ? `https://webictis.sfedu.ru/schedule-api/?group=${group}` : `https://webictis.sfedu.ru/schedule-api/?group=${group}&week=${week}`).then(async resp => {
            let table = {
                group: resp.data.table.group,
                type: resp.data.table.type,
                name: resp.data.table.name,
                week: resp.data.table.week,
                weeks: resp.data.weeks,
                position: resp.data.table.table[0],
                time: resp.data.table.table[1],
                subject: [
                    resp.data.table.table[2], resp.data.table.table[3], resp.data.table.table[4],
                    resp.data.table.table[5], resp.data.table.table[6], resp.data.table.table[7]
                ]
            }
            res(table)
        })
    });
}

// Возвращает расписание в виде готового текста
export async function getSchedule(group, day, week=-1) {
    return new Promise(async (res) => {
        await getTable(group, week).then(async table => {
            let text = `*Расписание - ${table.name} - ${table.week} неделя*\n\n`
            
            for (let i = 0; i < 6; i++) {    
                let temp;
                if (day !== i && day !== 6) continue;
                for (let j = 1; j < 8; j++) {
                    let position = table.position[j];
                    let time = table.time[j];
                    let subject = await table.subject[i][j].replace(RegExp(`^$`), "Окно")
                    let cabinet;
                    if (subject !== "Окно") {
                        if (subject.includes("LMS")) {
                            cabinet = "LMS"
                        }
                        if (subject[subject.length - 4] === "-") {
                            cabinet = subject.substring(subject.length - 5, subject.length)
                        }
                        if (subject.includes("ТК ИТА ЮФУ")) {
                            cabinet = "ТК ИТА ЮФУ"
                        }
                        subject = subject.replace(cabinet, "")
                        temp += `*${position} пара*\n Время: ${time}\n Кабинет: ${cabinet}\n ${subject}\n\n`
                    }
                }
                if (temp !== undefined) text += `*📅 ${table.subject[i][0]}*` + "\n" + temp.replace("undefined", "")
            }
            text += `Обновлено ${await getTime()}`
            res(text)
        })
    })
}

// Возвращает строку в консоль в виде "HH:MM:SS Текст"
export async function sendLog(text) {
    console.log(await getTime() + text)
}

// Возвращает строку в консоль в виде "HH:MM:SS"
export async function getTime() {
    return new Promise(async res => {
        let time = new Date()
        let date = `${time.getHours() <= 9 ? "0" + time.getHours() : time.getHours()}:${time.getMinutes() <= 9 ? "0" + time.getMinutes() : time.getMinutes()}:${time.getSeconds() <= 9 ? "0" + time.getSeconds() : time.getSeconds()} `
        res(date)
    })
}