// L表示左表达式，R表示右表达式
function instance(L, R) {
  // 取R的显式原型
  let O = R.prototype
  // 取L的隐式原型
  L = L.__proto__
  while(true) {
    // Object.prototype.__proto__ === null
    if(L === null) {
      return false
      // 当O严格等于L时返回true
    } else if (L === O) {
      return true
    }
    // 继续从原型上查找
    L = L.__proto__
  }
}

function C() {}
function D() {}

let o = new C()
console.log(instance(o, C))
console.log(instance(o, D))
