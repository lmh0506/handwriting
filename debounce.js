// fn 是需要防抖处理的函数
// 目的是频繁触发时再固定时间内只触发一次
// wait 是时间间隔
function debounce(fn, wait = 500) {
  // 通过闭包缓存一个定时器id
  let time = null
  // 将debounce处理结果当作函数返回
  // 触发事件回调时执行返回的这个函数
  return function(...arg) {
    // 如果设定过定时器就清除上一个定时器
    time && clearTimeout(time)
    // 创建一个新的定时器，定时器结束后执行fn
    time = setTimeout(() => {
      fn.apply(this, arg)
    }, wait)
  }
}

// DEMO
// 执行 debounce 函数返回新函数
const betterFn = debounce(() => console.log('fn 防抖执行了'), 1000)
// 停止滑动 1 秒后执行函数 () => console.log('fn 防抖执行了')
document.addEventListener('scroll', betterFn)
