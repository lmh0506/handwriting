// 函数节流指的是某个函数在一定时间间隔内（例如3秒）只执行一次，在这3秒内无视后来产生的函数调用请求

// fn 是需要执行的函数
// wait 是时间间隔
function throttle(fn, wait = 500) {
  // 上一次执行fn的时间
  let previous = 0
  // 将 throttle 处理结果当作函数返回
  return (...arg) => {
    // 获取当前时间，转换成时间戳，单位毫秒
    let now = Date.now()
    // 将当前时间和上一次执行函数的时间进行对比
    // 大于等待时间就把 previous 设置为当前时间并执行函数 fn
    if(now - previous > wait) {
      previous = now
      fn.apply(this, arg)
    }
  }
}


// 执行 throttle 函数返回新函数
let test = throttle(() => {
  console.log(Date.now())
}, 1000)

// 每 10 毫秒执行一次 test 函数，但是只有时间差大于 1000 时才会执行 fn
setInterval(test, 10)
