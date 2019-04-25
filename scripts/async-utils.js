const R = require('ramda');
const fs = require('fs');
const { promisify } = require('util');

const trycatch = f => new Promise((resolve, reject) => {
  let res; try { res = f() } catch (error) { return reject(error) } return resolve(res);
})

// Reading and updating files
const fileContents = file => promisify(fs.exists)(file)
  .then(res => res || promisify(fs.writeFile)(file, '[]', 'utf8'))
  .then(x => promisify(fs.readFile)(file))
  .then(res => trycatch(() => JSON.parse(res)))

const onFile = (func, file) => fileContents(file).then(func)

const updateFile = (func, file) => onFile(func, file)
  .then(data => promisify(fs.writeFile)(file, JSON.stringify(data), 'utf8').then(x => data))

exports.onFile = onFile;
exports.updateFile = updateFile;

exports.forEach = R.curry(async (callback, array) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
});

exports.map = async (func, array) => {
  let n = [];
  for (let index = 0; index < array.length; index++) {
    const x = await func(array[index], index);
    n = [].concat(n, x);
  }
  return Promise.resolve(n)
}

exports.find = async (func, array) => {
  let n = null;
  let acc = 0;
  while (!n && acc < array.length) {
    const found = await func(array[acc])
    if (found) { n = array[acc] }
  }
  return n;
}

// Retries promise failure
const retry = (limit=0, delay=0, acc=0) => f => f(acc)
  .catch(x => {
    if (acc >= limit) return f(acc);
    return new Promise((resolve, reject) => setTimeout(resolve, delay))
      .then(x => retry(limit, delay, acc + 1)(f))
  })

exports.retry = retry;

// Timeout Promise wrapper
exports.timeout = (ms, rej=null) => promise => {
  let timeoutProm = new Promise((resolve, reject) => { let id = setTimeout(() => { clearTimeout(id); log('TIMEDOUT'); reject(rej ? rej : 'Timed out in '+ ms + 'ms.') }, ms) })
  return Promise.race([ promise, timeoutProm ])
}
