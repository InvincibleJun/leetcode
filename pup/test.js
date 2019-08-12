async function start () {
  let s = 'abcabcabcabc';
  s = s.replace(/c/g, async () => {
    // console.log('cc')
    return await b();
  })

  console.log(s)
}

async function b () {
  return new Promise(rs => {
    setTimeout(() => {
      rs('d');
    },3000)
  })
}


!async function () {
  await start();
} ()
