// 用 JS 实现一个无限累加的函数 add，示例如下：
// add(1); // 1
// add(1)(2);  // 3
// add(1)(2)(3); // 6
// add(1)(2)(3)(4); // 10 
// 以此类推

function add(num) {
  console.log(num)
  return num2 => add(num + num2)
}

add(1); // 1
add(1)(2);  // 3
add(1)(2)(3); // 6
add(1)(2)(3)(4); // 10 
