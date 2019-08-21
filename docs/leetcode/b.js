function calculate(str) {
    let tmps = str.replace(/ /g, '');
    let count = [];
    // let flag = 0;
    // let prev = 0;
    for (let i = 0, l = tmps.length; i < l; i++) {
        let item = tmps[i];
        // 数字合并 
        if (/\d/.test(item)) {
            while (/\d/.test(tmps[i + 1])) {
                item += tmps[i + 1];
                i++;
            }
        }

        if (item === '(') {
          let tmp = [];
          tmp.unshift(item);
          while(item.length) {
            i++
            if (item[i] === ')') {
              tmp.shift();
            } 
          }
        } else {
          count.push(item)
        }
    }

    // return compute(stack.reverse());
    // return stack
}

function compute(stack) {
    let count = 0;
    while (stack.length) {
        if (stack[0] === '+') {
            stack.shift();
            count += +stack[0];
        } else if (stack[0] === '-') {
            stack.shift();
            count -= +stack[0];
        } else {
            count = +stack[0];
        }
        stack.shift();
    }
    return count;
}

const s = require('fs').readFileSync('./test', 'utf-8');
let d = +new Date();
console.log(calculate(s));

console.log((+new Date() - d) / 1000 + 's');
