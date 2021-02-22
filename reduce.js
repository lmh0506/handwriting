// 手写reduce方法
Array.prototype.myReduce = function(fn, prev) {
  for(let i = 0; i < this.length; i++) {
    if(typeof prev === 'undefined') {
      // 初始值不传时的特殊处理，会默认使用数组中的第一个元素
      prev = fn(this[i], this[i + 1], i+ 1, this)
      ++i
    } else {
      // 回调函数fn接受四个参数
      // prev: 上一次调用回调时返回的值
      // next：正在处理的元素
      // currentIndex: 正在处理元素的索引
      // array: 正在遍历的集合对象
      prev = fn(prev, this[i], i, this)
    }
  }
  // 返回结果作为下一次循环的prev
  return prev
}

// 测试用例
let sum = [1, 2, 3].myReduce((prev, next) => {
  return prev + next
});

console.log(sum); // 6
