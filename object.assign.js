if(typeof Object.myAssign != 'function') {
  // 判断原生Object是否支持该函数，如果不存在的话创建一个函数assign，并使用Object.defineProperty将该函数绑定到Object上
  Object.defineProperty(Object, 'myAssign', {
    value: function(target) {
      'use strict';
      // 判断参数是否正确(目标对象不能为空，我们可以直接设置{}传递进去，但必须设置值)
      if(target == null || target == undefined) {
        throw new TypeError('Cannot convert undefine or null to object')
      }

      // 使用Object()转换成对象，并保存为to，最后返回这个对象to
      let to = Object(target)
      // 第一个参数是目标对象 所以index从1开始
      for(let index = 1; index < arguments.length; index ++) {
        // 支持传入多个对象合并
        let nextSource = arguments[index]
        if(nextSource) {
          // 使用for...in循环遍历出所有可枚举的自有属性，并复制给新的目标对象(使用hasOwnProperty获取自有属性，即非原型链上的属性)
          for(let nextKey in nextSource) {
            if(Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey]
            }
          }
        }
      }

      return to
    },
    writable: true,
    configurable: true
  })
}

let a = {
  name: 'test',
  age: 11
}

let b = {
  name: 'haha',
  book: {
    title: 'hello world',
    price: 66
  }
}

let c = Object.myAssign(a, b)
console.log(c)

console.log(a == c)

// 原生情况下挂载在Object上的属性是不可枚举的 但是直接在Object上挂载属性a之后是可枚举的，所以这里必须使用Object.defineProterty, 并设置enumerable：false，以及writeable： true，configurable：true
for(let i in Object) {
  console.log(Object[i])
}

console.log(Object.keys(Object))
