Function.prototype.myCall = function(ctx) {
  // 如果传null或undefined this 默认指向window
  // this参数可以传基本类型数据，原生的call会自动用Object()转换
  ctx = ctx ? Object(ctx) : Window
  // 保持fn的key的唯一性
  let fnKey = Symbol('fn')
  // 首先要获取调用call的函数，用this可以获取
  ctx[fnKey] = this // 将函数设置为对象的属性

  // 取第一位之后的参数 第一位是绑定的对象
  // 函数是可以有返回值的
  let result = ctx[fnKey](...[...arguments].slice(1))

  delete ctx[fnKey] // 删除函数
  return result
}

function test(name, age){
  console.log(name)
  console.log(age)
  console.log(this.value)
}

let obj = {
  value: 123
}

test.myCall(obj, 'test', 11)
