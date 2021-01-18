Function.prototype.myBind = function(ctx, ...arg) {
  // this指向调用者
  let self = this
  let fBound = function(...resFnArg) {
    
    // 可以指定this指向,  传入绑定函数的参数和返回函数的参数
    return self.apply(
      // 作为构造函数时，this指向实例，此时 this instance fBound 结果为 true，可以让实例获得来自绑定函数的值
      // 作为普通函数时，this 指向 window, 此时结果为false 将绑定函数的this指向context
      this instanceof fBound ? this : ctx,
      arg.concat(resFnArg))
  }

  let fNop = function() {}
  // 空对象的原型指向绑定函数的原型
  fNop.prototype = this.prototype

  // 修改返回函数的prototype为绑定函数的prototype，实例就可以继承绑定函数的原型中的值
  // 空对象的实例赋值给 fBound.prototype
  fBound.prototype = new fNop()
  // 返回一个函数
  return fBound
}

let obj = {
  value: 'test'
}

function test(name, age) {
  this.attr = 'attr'
  console.log(name)
  console.log(age);
  console.log(this.value)
}

test.prototype.haha = 'haha'

let bindTest = test.bind(obj, 'name')
bindTest('age')

let testObj = new bindTest('new Age')

console.log(testObj.attr, testObj.haha)
