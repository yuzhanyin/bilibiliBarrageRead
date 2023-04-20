/*
 * @Description: 
 * @Author: 俞瞻寅
 * @Date: 2023-04-20 09:30:57
 * @LastEditors: 俞瞻寅
 * @LastEditTime: 2023-04-20 16:05:01
 */
const  { startListen } = require('blive-message-listener')

const { roomId } = require('./config/config')
const { dayFormat, getBarrageReply,buildQueue } = require('./utils/index')

const thisDay = dayFormat(new Date(),'yyyy-MM-dd')

const queue = buildQueue()

const handler = {
  onIncomeDanmu: (msg) => {
    const { user: { uname:username }, content } = msg.body
    getBarrageReply(username, content, thisDay,queue)
  },
  onIncomeSuperChat: (msg) => {
    const { user: { uname:username }, content } = msg.body
    console.log(`${username}：${content}`)
  },
  onError: (err) => {
    console.log(err)
  }
}

const instance = startListen(roomId, handler)

// 30秒后停止监听
setTimeout(() => {
    instance.close()
    console.log('stop listen')
}, 30000)

