import axios from "axios";
import { writeFileSync, readFile, existsSync } from "fs";

// Возвращает номер группы
export async function getGroup(query) {
    return new Promise(async (res, rej) => {
        console.log(query)
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
            .catch(async error => rej("Не удалось отправить запрос на сервер ИКТИБ. Возможно он временно недоступен, попробуйте отправить запрос позже."))
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
export async function getSchedule(group, day, id, week=-1) {
    return new Promise(async (res) => {
        await getTable(group, week).then(async table => {
            await addStats(id);

            let text = `*📚 Расписание - ${table.name} - ${table.week} неделя*\n\n`
            for (let i = 0; i < 6; i++) {    
                let temp;
                if (day !== i && day !== 6) continue;
                for (let j = 1; j < 8; j++) {
                
                    let position = j.toString().replace('1', '📕').replace('2', '📗').replace('3', '📘').replace('4', '📙').replace('5', '📕').replace('6', '📗').replace('7', '📘');
                    let time = table.time[j];
                    let subject = await table.subject[i][j].replace(RegExp(`^$`), "Окно")
                    
                    if (subject.includes("LMS")) position = position.replace('📕', '📺').replace('📗', '📺').replace('📘', '📺').replace('📙', '📺')

                    
                    if (subject !== "Окно") {
                        temp += `${position}${subject} ${time}\n\n`
                    }
                }
                if (temp !== undefined) text += `*${table.subject[i][0]}*\n${temp.replace("undefined", "")}`
            }
            if(text === `*📚 Расписание - ${table.name} - ${table.week} неделя*\n\n`) {
                text += 'Выходной!'
                res(text)
            }
            text += `Обновлено ${await getTime()}`
            res(text)
        })
    })
}

// Логирование
export async function sendLog(text) {

    readFile('logs.txt', async (err, data) => {
        data += `${await getTime()} ${text}\n`
        writeFileSync("logs.txt", data)
    });

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

// БД
export async function checkFileDB() {
    if(!existsSync('./users.json')) {
        sendLog('Файл с данными был создан')
        writeFileSync('users.json', '{"users": [], "stats": {"schedulesReceivedTotal": 0}}')
    }
    if(!existsSync('./logs.txt')) {
        sendLog('Файл с логами был создан')
        writeFileSync('users.json', '{"users": [], "stats": {"schedulesReceivedTotal": 0}}')
    }
}

// Пользователь
export async function findID(id) {
    return new Promise(async res => {
        readFile('users.json', (err, data) => {
        
            let users = JSON.parse(data).users;
            let result = 0;
            
            for (let i=0; i < users.length; i++) {
                if (users[i].id === id) {
                    result = users[i].id
                    break;
                }
            }

            res(result)

        });
    })

}

export async function addUser(id) {
    findID(id).then(result => {
        if (result === 0) {
            readFile('users.json', (err, data) => {
            
                let user = {
                    id: id,
                    groups: [],
                    schedulesReceived: 0
                }
        
                let db = JSON.parse(data);
                db.users.push(user);
            
                writeFileSync("users.json", JSON.stringify(db));
                sendLog(`Пользователь с ID ${id} был добавлен в БД`);
                
            })
        }
    })
}

export async function getUser(id) {
    return new Promise(async res => {
        readFile('users.json', (err, data) => {

            let users = JSON.parse(data).users;

            for (let i=0; i < users.length; i++) {                
                if (users[i].id === id) {
                    res(users[i]);
                    break;
                }
            }
        });
    })
}

// Избранное
export async function getFavorites(id) {
    return new Promise(async res => {
        readFile('users.json', (err, data) => {        
            let db = JSON.parse(data);
            
            let users = db.users
            
            for (let i=0; i < users.length; i++) {
    
                if (users[i].id === id) {
                    res(users[i].groups)
                    break;
                }
            }
        })
    })
}

export async function addFavorite(id, group) {
    readFile('users.json', (err, data) => {        
        let db = JSON.parse(data);
        let users = db.users

        for (let i=0; i < users.length; i++) {
            if (users[i].id === id) {
                getFavorites(id).then(async favorites => {
                    let flag = true
                    favorites.forEach(favorite => {
                        if (favorite === group) {
                            flag = false
                        }
                    });
                    if (flag) users[i].groups.push(group)
                })
                
                break;
            }
        }

        writeFileSync('users.json', JSON.stringify(db))
    })
}

export async function removeFavorite(id, group) {
    readFile('users.json', (err, data) => {        
        let db = JSON.parse(data);

        for (let i=0; i < db.users.length; i++) {
            let user = db.users[i]
            
            if (user.id === id) {
                for (let j=0; i < user.groups.length; j++) {
                    if (group === user.groups[j]) {
                        user.groups.splice(j, 1);
                        break;
                    }
                }
                break;
            }
        }

        writeFileSync('users.json', JSON.stringify(db))
    })
}

export async function isFavorite(id, group) {
    return new Promise(async res => {
        readFile('users.json', (err, data) => {  
            let db = JSON.parse(data);
            let flag = false

            for (let i=0; i < db.users.length; i++) {
                let user = db.users[i]
                if (user.id === id) {
                    for (let j=0; j < user.groups.length; j++) {
                        if (group === user.groups[j]) {
                            flag = true;
                            break;
                        }
                    }
                    break;
                }
            }

            res(flag)
        })
    })
}

// Статистика
export async function getStats(id) {
    return new Promise(async res => {
        getUser(id).then(async user => {
            readFile('users.json', async (err, data) => {
                let stats = {
                    schedulesReceived: user.schedulesReceived,
                    schedulesReceivedTotal: 0,
                    favorites: user.groups.length,
                    users: 0
                }
                
                let db = await JSON.parse(data);

                stats.schedulesReceivedTotal = db.stats.schedulesReceivedTotal
                stats.users = db.users.length

                res(stats)  
            })
        })
    })
}

export async function addStats(id) {
    readFile('users.json', (err, data) => {

        let db = JSON.parse(data);

        db.stats.schedulesReceivedTotal += 1

        for (let i=0; i < db.users.length; i++) {                
            if (db.users[i].id === id) {
                db.users[i].schedulesReceived += 1;
                break;
            }
        }  

        writeFileSync("users.json", JSON.stringify(db));
    })
}