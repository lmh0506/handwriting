function isObject(o) {
  return typeof o === 'object' && o != null
}

function cloneDeep(source, hash = new WeakMap()) {
  // 非对象返回自身
  if(!isObject(source)) return source
  // 如果hash表中已存在对象的引用则直接返回  解决循环引用的问题
  if(hash.has(source)) return hash.get(source)

  // 兼容数组
  let target =  Array.isArray(source) ? [] : {}
  hash.set(source, target) // 给hash表设值

  // 查找symbol属性
  let symKeys = Object.getOwnPropertySymbols(source)
  if(symKeys.length) {
    symKeys.forEach(symKey => {
      if(isObject(source[symKey])) {
        // 每次递归中传入hash表
        target[symKey] = cloneDeep(source[symKey], hash)
      } else {
        target[symKey] = source[symKey]
      }
    })
  }

  for(let key in source) {
    if(Object.prototype.hasOwnProperty.call(source, key)) {
      if(isObject(source[key])) {
        // 每次递归中传入hash表
        target[key] = cloneDeep(source[key], hash)
      } else {
        target[key] = source[key]
      }
    }
  }

  return target
}

// 测试用例
var a = {
  name: "test",
  book: {
      title: "You Don't Know JS",
      price: "45"
  },
  a1: undefined,
  a2: null,
  a3: 123
}
// 循环引用
a.circleRef = a

// 设置symbol
var sym1 = Symbol("a"); // 创建新的symbol类型
var sym2 = Symbol.for("b"); // 从全局的symbol注册?表设置和取得symbol

a[sym1] = "localSymbol";
a[sym2] = "globalSymbol";

var b = cloneDeep(a);

a.name = "hahaha";
a.book.price = "55";

console.log(b);
