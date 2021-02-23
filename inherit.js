// 寄生组合式继承
function inheritPrototype(superType, subType) {
  // 创建对象，创建父类原型的一个副本
  let prototype = Object.create(superType.prototype)
  // 增强对象，弥补因重写原型而失去默认的constructor属性
  prototype.constructor = subType
  // 指定对象，将新创建的对象赋值给子类的原型
  subType.prototype = prototype
}

// 初始化父类的实例属性和原型属性
function SuperType(name) {
  this.name = name
  this.colors = ['red', 'green', 'blue']
}

SuperType.prototype.sayName = function() {
  console.log(this.name)
}

// 借用构造函数传递增强子类实例属性(支持传参和避免篡改)
function SubType(name, age) {
  SuperType.call(this, name)
  this.age = age
}

// 将父类原型指向子类
inheritPrototype(SuperType, SubType)

// 新增子类原型属性
SubType.prototype.sayAge = function() {
  console.log(this.age)
}

let o1 = new SubType('abc', 12)
let o2 = new SubType('zxc', 23)

o1.colors.push('white')
o2.colors.push('black')

o1.sayAge()
o1.sayName()
o2.sayAge()
o2.sayName()
console.log(o1.colors)
console.log(o2.colors)
console.log(o1)
console.log(o2)