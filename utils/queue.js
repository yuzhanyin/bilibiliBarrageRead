/*
 * @Description: 定义一个队列类
 * @Author: 俞瞻寅
 * @Date: 2023-04-20 16:10:15
 * @LastEditors: 俞瞻寅
 * @LastEditTime: 2023-04-20 16:15:45
 */

class Queue {
    constructor() {
        this.queue = []
        this.running = false
    }

    add(fn) {
        this.queue.push(fn)
        this.next()
    }

    next() {
        if (this.running || this.queue.length === 0) return
        this.running = true
        const fn = this.queue.shift()
        fn().then(() => {
            this.running = false
            this.next()
        })
    }

    clear() {
        this.queue = []
    }
}

module.exports = Queue