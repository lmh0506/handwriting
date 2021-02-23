import { rejects } from "assert";

// 手写promise实现
var promisesAplusTests = require("promises-aplus-tests");
type STATUS = 'pending' | 'fulfilled' | 'rejected'
type CALLBACK = (v: any) => any

class MyPromise {
  status: STATUS;
  value: any;
  // 成功/失败回调必须是一个function，不是函数将被忽略
  onResoveCallbacks: CALLBACK[];
  onRejectCallbacks: CALLBACK[];
  
  static deferred() {
    let defer = {
      promise: undefined,
      resolve: undefined,
      reject: undefined
    };
    defer.promise = new MyPromise(function (resolve, reject) {
      defer.resolve = resolve;
      defer.reject = reject;
    });
    return defer;
  }

  static all(promisees: MyPromise[]) {
    return new MyPromise((resolve, reject) => {
      // arr为最终返回值
      const arr = []
      let i = 0
      function processData(index, y) {
        arr[index] = y
        if(++i === promisees.length) {
          // 等全部取到值后一起返回
          resolve(arr)
        }
      }

      for(let i = 0; i < promisees.length; i++) {
        promisees[i].then(y => {
          processData(i, y)
        }, reject)
      }
    })
  }

  static allSettled(promisees: MyPromise[]) {
    return new MyPromise((resolve, reject) => {
      // arr为最终返回值
      const arr = []
      let i = 0
      function processData(index, status, value) {
        arr[index] = {status, value}
        if(++i === promisees.length) {
          // 等全部取到值后一起返回
          resolve(arr)
        }
      }
      for(let i = 0; i < promisees.length; i++) {
        promisees[i].then(res => {
          processData(i, 'fulfilled', res)
        }, err => {
          processData(i, 'rejected', err)
        })
      }
    })
  }

  static race(promisees: MyPromise[]) {
    return new MyPromise((resolve, reject) => {
      for(let i = 0; i < promisees.length; i++) {
        // 取到值后直接resolve  因为resolve只触发一次
        promisees[i].then(resolve, reject)
      }
    })
  }

  static resolve(val) {
    return new MyPromise((resolve, reject) => {
      resolve(val)
    })
  }

  static reject(val) {
    return new MyPromise((resolve, reject) => {
      reject(val)
    })
  }
  
  constructor(executor: Function) {
    // 一个 promise 必须处于 pending fulfilled rejected 三种状态之间
    // 初始化状态 可以转换为其他两个状态
    this.status = 'pending'

    // 定义缓存通过then注册的成功，失败回调的数组，支持 then 方法注册多个回调
    this.onResoveCallbacks = []
    this.onRejectCallbacks = []

    // 缓存this 避免this指向问题导致bug
    const self = this

    // 定义成功失败方法，作为promise传入的函数体的参数
    // 处于成功失败状态不能够转换到其他状态，必须有对应的成功值value 或者 失败原因 reason
    function reject (v) {
      // 失败状态原因引用不可更改 使用const
      const reason = v
      // 为了防止在平台代码执行完毕，完全注册回调之前调用回调，采用宏任务 setTimeout
      setTimeout(() => {
        if(self.status === 'pending') {
          self.status = 'rejected'
          self.value = reason
          // 失败回调 必须在失败之后被调用，第一个参数必须是 reason
          self.onRejectCallbacks.forEach(callback => callback(self.value))
        }
      })
    }

    function resolve (value) {
      // 为了防止在平台代码执行完毕，完全注册回调之前调用回调，采用宏任务 setTimeout
      setTimeout(() => {
        if(self.status === 'pending') {
          self.status = 'fulfilled'
          self.value = value
          // 成功回调 必须在成功之后被调用，第一个参数必须是 value
          self.onResoveCallbacks.forEach(callback => callback(self.value))
        }
      })
    }

    // 开始执行函数体，捕获错误，执行报错则直接拒绝promise
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err)
    }
  }

  // promise resolution procedure promise解决程序实际上是一种承诺实现的抽象，将promise和值x作为输入，表示为[[Resolve]](promise, x)
  // 如果x是可能的，则在x的行为至少类似于承诺的假设下，尝试使承诺采用x的状态。否则它将以x履行承诺
  // 这种对可实现对象的处理使答应实现可以互操作，只要他们公开了符合 promise/A+ 的then方法即可
  // 它还允许promise/A+ 实现使用合理的then方法整合不合格的实现
  // 解析程序实际上保证了promise的可靠性，对thenable对象状态的判断，循环解析，直到x作为一个普通的不能在被解析的非thenable才实现调用，
  // 对错误的处理也贯彻整个流程，并且保证了调用的唯一性，这实现了那句可互操作的javascrip保证
  resolvePromise(promise2: MyPromise, x, resolve, reject) {
    const self = this
    // 如果promise 和 x指向同一个对象，以一个TypeError作为原因拒绝promise
    if(promise2 === x) return reject(new TypeError('循环引用'))
    
    // 如果x是一个promise（是自己的实例instance）采用下面的状态
    if(x instanceof MyPromise) {
      // 如果在pending状态 promise2必须保持pending状态直到x被fulfilled/rejected
      if(x.status === 'pending') {
        x.then(function (y) {
          self.resolvePromise(promise2, y, resolve, reject)
        }, reject)
      } else {
        // 如果x被fulfilled/rejected, promise2必须保持 x 相同的value/reason 被fulfilled/rejected
        x.then(resolve, reject)
      }
      // 如果x为对象或者函数
    } else if (x && ((typeof x === 'object') || (typeof x === 'function'))) {
      let called = false

      try {
        // 访问x的then属性 实际上该操作可能会报错，一般来说访问一个对象的属性不会报错，但是如果该属性是一个getter的时候，在执行getter的时候可能会抛出异常e
        // 此时应该以e拒绝promise2
        const then = x.then
        // 当then是一个function
        if(typeof then === 'function') {
          try {
            // 通过then.call(x)调用他，同时给x注册成功处理函数和失败处理函数
            then.call(x, function(y) {
              // 如果成功失败回调被多次调用 那么第一次的调用将优先调用，其他的调用将被忽略，这里需要添加called标志是否被调用，在每次调用成功失败时校验，并调用时立马修改标志位状态
              if(called) return
              called = true
              // 当成功回调被执行并传入y的时候，继续解析
              self.resolvePromise(promise2, y, resolve, reject)
            }, function(e) {
              if(called) return
              called = true
              // 当失败回调被执行并传入e的时候，把e作为reason拒绝promise2
              reject(e)
            })
          } catch(e) {
            if(called) return
            called = true

            reject(e)
          }
        } else {
          // 如果 then 不是函数，以 x 为参数执行 promise
          resolve(x)
        }
      } catch (e) {
        if(called) return
        called = true

        reject(e)
      }
    } else {
      // 如果 x 不为对象或者函数，以 x 为参数执行 promise
      resolve(x)
    }

  }

  // then 方法必须返回一个 Promise的实例
  then(onFulfilled: CALLBACK, onRejected?: CALLBACK): MyPromise {
    // 缓存this
    const self = this

    // 成功/失败回调 必须作为函数被调用，如果拿到的参数不是函数，忽略它，生成默认的同步执行函数，以相同的值进行后续回调
    // promise1 的 成功/失败回调 不是一个 function 而且 promise1 成功/失败时，promise2 必须以相同的value/e 被成功或者拒绝
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : x => x
    onRejected = typeof onRejected === 'function' ? onRejected : e => { throw e }

    let promise2: MyPromise;

    function fulfillCallback(resolve, reject) {
      // 为了防止在平台代码执行完毕，完全注册回调之前调用回调，采用宏任务 setTimeout
      setTimeout(() => {
        try{
          const x = onFulfilled(self.value)
          // promise1 成功回调 正确执行拿到一个返回值 x  运行Promise Resolution Procedure解析程序[Resolve]](promise2, x)
          self.resolvePromise(promise2, x, resolve, reject)
        } catch (error) {
          // 如果 onFulfilled 抛出异常 则 promise2 必须用相同的理由拒绝
          reject(error)
        }
      })
    }

    function rejectCallback(resolve, reject) {
      // 为了防止在平台代码执行完毕，完全注册回调之前调用回调，采用宏任务 setTimeout
      setTimeout(() => {
        try {
          const e = onRejected(self.value)
          // promise1 失败回调 正确执行拿到一个返回值 x  运行Promise Resolution Procedure解析程序[Resolve]](promise2, x)
          self.resolvePromise(promise2, e, resolve, reject)
        } catch (error) {
          // 如果 onRejected 抛出异常 则 promise2 必须用相同的理由拒绝
          reject(error)
        }
      })
    }

    if(self.status === 'fulfilled') {
      return promise2 = new MyPromise((resolve, reject) => {
        fulfillCallback(resolve, reject)
      })
    }

    if(self.status === 'rejected') {
      return promise2 = new MyPromise((resolve, reject) => {
        rejectCallback(resolve, reject)
      })
    }

    if(self.status === 'pending') {
      return promise2 = new MyPromise((resolve, reject) => {
        self.onResoveCallbacks.push(() => {
          fulfillCallback(resolve, reject)
        })

        self.onRejectCallbacks.push(() => {
          rejectCallback(resolve, reject)
        })
      })
    }

  }
}

// promisesAplusTests(MyPromise, function (err) {
//   // All done; output is in the console. Or check `err` for number of failures.
//   console.log(err)
// });

// let p = new MyPromise((resolve, reject) => {
//   console.log(22)
//   resolve(11)
// })
// console.log(p)

let p1 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(1)
  }, 1000)
})
let p2 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    reject(new Error('2'))
  }, 2000)
})
console.log(Date.now())
MyPromise.allSettled([p1, p2]).then(res => {
  console.log(Date.now())
  console.log(res)
}, err => {
  console.log(Date.now())
  console.log(err)
})

MyPromise.all([p1, p2]).then(res => {
  console.log(Date.now())
  console.log(res)
}, err => {
  console.log(Date.now())
  console.log(err)
})

export default MyPromise
