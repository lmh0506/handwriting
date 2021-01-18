// 手写一个new实现
function create() {
  // 创建一个空对象
  let obj = new Object();
  // 去除并获取第一个参数 即构造函数
  let Con = [].shift.call(arguments)
  // 将obj的原型指向构造函数，obj可以访问到构造函数原型中的函数
  obj.__proto__ = Con.prototype
  // 绑定 this 实现继承，obj可以访问到构造函数中的属性
  let ret = Con.apply(obj, arguments)
  // 优先返回构造函数返回的对象
  return ret instanceof Object ? ret : obj
}

// 使用这个手写new
function Person(name) {
  console.log('new Person')
  this.name = name
  console.log('person name:' + this.name)
}

// 使用内置函数new
let normalPerson = new Person('normal')

// 使用手写的new
let handPerson = create(Person, 'hand')
