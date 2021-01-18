// 用 JS 实现一个无限累加的函数 add，示例如下：
// add(1); // 1
// add(1)(2);  // 3
// add(1)(2)(3); // 6
// add(1)(2)(3)(4); // 10 
// 以此类推

function add(num) {
  // 使用闭包
  function sum(num2) {
    // 累加
    num += num2
    return sum
  }
  // 重写toString方法
  sum.toString = function() {
    return num
  }
  return sum
}
// 打印函数时会自动调用toString()方法
console.log(add(1)); // 1
console.log(add(1)(2));  // 3
console.log(add(1)(2)(3)); // 6
console.log(add(1)(2)(3)(4)); // 10 
