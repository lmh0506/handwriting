// 手动实现观察者模式
// 观察者模式（基于发布订阅模式）有观察者，也有被观察者
// 观察者需要被放到被观察者中，被观察者的状态变化需要通知观察者 我变化了 内部也是基于发布订阅模式，收集观察者，状态变化后要主动通知观察者

// 被观察者 学生
class Subject {
  constructor(name) {
    this.state = '开心的'
    this.observers = [] // 存储所有的观察者
  }
  // 收集所有的观察者
  attach(o) {
    this.observers.push(o)
  }
  // 更新被观察者状态的方法
  setState(newState) {
    this.state = newState // 更新状态
    // this 指被观察者 学生
    this.observers.forEach(o => o.update(this)) // 通知观察者 更新他们的状态
  }
}

// 观察者 父母和老师
class Observer {
  constructor(name) {
    this.name = name
  }

  update(student) {
    console.log(`当前${this.name}被通知了，当前学生的状态是${student.state}`)
  }
}

let student = new Subject('学生'); 

let parent = new Observer('父母'); 
let teacher = new Observer('老师'); 

// 被观察者存储观察者的前提，需要先接纳观察者
student.attach(parent); 
student.attach(teacher); 
student.setState('被欺负了');