// 手动实现发布订阅
// 发布订阅的核心：每次event.emit (发布)，就会触发一次event.on (注册)

class EventEmitter {
  constructor() {
    // 事件对象，存放订阅的名字和事件
    this.events = {}
  }
  // 订阅事件的方法
  on(eventName, callback) {
    if(!this.events[eventName]) {
      // 注意数据，一个名字可以订阅多个事件函数
      this.events[eventName] = [callback]
    } else {
      // 存在则push到指定的数组的尾部保存
      this.events[eventName].push(callback)
    }
  }

  // 取消订阅事件的方法
  off(eventName, callback) {
    let event = this.events[eventName]
    if(event) {
      let index = event.findIndex(item => item === callback)
      event.splice(index, 1)
      this.events[eventName] = event
    }
  }

  // 触发事件的方法
  emit(eventName) {
    // 遍历执行所有订阅的事件
    this.events[eventName] && this.events[eventName].forEach(cb => cb())
  }
}

// 测试用例
let em = new EventEmitter();

function workDay() {
  console.log("每天工作");
}
function makeMoney() {
    console.log("赚100万");
}
function sayLove() {
  console.log("向喜欢的人示爱");
}
em.on("money",makeMoney);
em.on("love",sayLove);
em.on("work", workDay);

em.emit("money");
em.emit("love");  
em.emit("work"); 

em.off("work", workDay);

em.emit("money");
em.emit("love");  
em.emit("work"); 