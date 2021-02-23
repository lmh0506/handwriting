// 实现 Promise.retry，成功后 resolve 结果，失败后重试，尝试超过一定次数才真正的 reject
Promise.retry = (fn, num = 3) => {
  return new Promise(async (resolve, reject) => {
    while(num--) {
      try {
        let res = await fn()
        console.log(res)
        resolve(res)
        break
      } catch(e) {
        console.log(e)
        if(num === 0) {
          reject(e)
        }
      }
    }
  })
}

function getProm() {
  const n = Math.random();
  return new Promise((resolve, reject) => {
    setTimeout(() =>  n > 0.5 ? resolve('success') : reject('error'), 500);
  });
}
Promise.retry(getProm);