// 实现一个简单的模板字符串替换
// 实现一个 render(template, context) 方法，将template中的占位符用context填充
// 要求：级联的变量也可以展开分隔符与变量之间允许有空格
var template = '{{ name    }}很厉害, 才{{  age  }}岁'
var context = {name: 'bottle', age: 15}

// 正解
function render(template, context) {
  return template.replace(/{{(.*?)}}/g, (match, key) => context[key.trim()])
}
console.log(render(template, context))
