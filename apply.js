Function.prototype.myApply = function(ctx, arr) {
  // 如果传null或undefined this 默认指向window
  // this参数可以传基本类型数据，原生的 apply 会自动用Object()转换
  ctx = ctx ? Object(ctx) : Window
  // 保持fn的key唯一性
  let fnKey = Symbol('fn')
  // 首先要获取调用 apply 的函数，用this可以获取
  ctx[fnKey] = this // 将函数设置为对象的属性

  // 函数是可以有返回值的  第二个参数必须是数组
  let result = Array.isArray(arr) ? ctx[fnKey](...arr) : ctx[fnKey]()

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

test.myApply(obj,[ 'test', 11])
