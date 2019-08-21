function calculate(str) {
    let tmps = str.replace(/ /g, '');
    let stack = [];

    for (let i = 0, l = tmps.length; i < l; i++) {
        let item = tmps[i];
        if (/\d/.test(item)) {
            while (/\d/.test(tmps[i + 1])) {
                item += tmps[i + 1];
                i++;
            }
        }
        if (item === ')') {
            let tmp = [];
            while (stack[0] !== '(') {
                tmp.unshift(stack.shift());
            }
            if (stack[0] === '(') {
                stack.shift();
            }
            let conut = compute(tmp);
            stack.unshift(conut);
        } else {
            stack.unshift(item);
        }
    }

    return compute(stack.reverse());
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
