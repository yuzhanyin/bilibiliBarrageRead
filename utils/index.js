
const { chatGlmUrl, historyPath } = require('../config/config')
const axios = require('axios')
const fs = require('fs')
const path = require('path')
const Queue = require('./queue')

/**
 * @description: 获取弹幕内容和发言用户然后组装成chatglm的问答方式去请求回复
 * @param {*} username
 * @param {*} content
 * @param {*} date
 * @return {*}
 */
const getBarrageReply = (username, content, date,queue) => {
    const history = getHistory(date, username)
    setQueue(username,content,history,queue)
}
/**
 * @description: 获取chatglm的回复并存入历史记录
 * @param {*} userRemark
 * @return {*}
 */
const getReplay = async (username, content ,history) => {
    const userRemark = `@-${username}-：${content} `
    const params = {
        prompt: userRemark,
        history: history,
    }
    const result = await axios.post(chatGlmUrl, params)
    const { response: chatGlmReplayStr, history: newHistory} = result.data
    setNewHistory(date, username, newHistory)
}

/**
 * @description: 通过日期获取历史记录json文件，并从中获取该用户的历史记录，如果没有该json文件则创建一个json文件
 * @param {*} date
 * @param {*} username
 * @return {*}
 */
const getHistory = (date, username) => {
    const filePath = path.resolve(__dirname, `${historyPath}${date}`)
    // 如果文件不存在则创建一个
    if (!fs.existsSync(filePath)) {
        buildHistoryFile(date)
    }
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const history = JSON.parse(fileContent)
    const user = history.find((item) => item.username === username)
    // 如果没有该用户的历史记录则创建一个
    if (!user) {
        history.push({
            username: username,
            history: [],
        })
        // 重新写入文件
        fs.writeFileSync(filePath, JSON.stringify(history))
        return []
    } else {
        return user.history
    }
    
}

/**
 * @description: 设置新的历史记录
 * @param {*} date
 * @param {*} username
 * @param {*} newHistory
 * @return {*}
 */
const setNewHistory = (date, username, newHistory) => {
    const filePath = path.resolve(__dirname, `${historyPath}${date}`)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const history = JSON.parse(fileContent)
    const user = history.find((item) => item.username === username)
    user.history = [...newHistory]
    fs.writeFileSync(filePath, JSON.stringify(history))
}
/**
 * @description: 按照yyyy-MM-dd的日期格式命名生成json文件
 * @return {*}
 */
const buildHistoryFile = (date) => {
    const filePath = path.resolve(__dirname, `${historyPath}${date}`)
    const fileContent = JSON.stringify([])
    fs.writeFileSync(filePath, fileContent)
    return filePath
}

/**
 * @description: 日期格式化
 * @param {*} date
 * @param {*} type
 * @return {*}
 */
const dayFormat = (date = new Date(),type) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    const result = type.replace(/yyyy/, year)
        .replace(/MM/, month)
        .replace(/dd/, day)
        .replace(/HH/, hour)
        .replace(/mm/, minute)
        .replace(/ss/, second)
    return result
}

/**
 * @description: 文字转语音并播放
 * @param {*} str
 * @return {*}
 */
const strToTTs = (str) => {
    const tts = new TTS()
    tts.speak(str)
}

/**
 * @description: 设置队列
 * @param {*} username
 * @param {*} content
 * @param {*} history
 * @return {*}
 */
const setQueue = async (username, content, history, queue) => {
    const replay = await getReplay(username, content, history)
    queue.add(strToTTs(replay))
}

/**
 * @description: 构建队列
 * @return {*}
 */
const buildQueue = () => {
    const queue = new Queue()
    return queue
}

modules.exports = {
    dayFormat,
    getBarrageReply,
    buildQueue
}