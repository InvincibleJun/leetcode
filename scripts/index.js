const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');
const request = require('request');

// 启动puppeteer
async function start () {
  const browser = await puppeteer.launch();
  await getAllTag(browser);
  await createMKDownFiles(browser);
  await browser.close();
  await createSilder();
}

async function getAllTag(browser) {
  const page = await browser.newPage();

  // 拉取所有标签
  await page.goto('https://leetcode-cn.com/problemset/algorithms/');
  await sleep(5000);
  const tagList = await page.evaluate(() => {
    const tags = document.querySelectorAll(
      '.filter-dropdown-menu-tabs .false.tag-category div'
    );
    const tagList = [].slice.call(tags, 0).map(val => {
      let name = val.querySelector('span').innerHTML;
      let title = val.getAttribute('title');
      let path = (title ? title : name).replace(/ /g, '-').toLowerCase();
      return {
        name,
        path,
        title
      };
    });

    return tagList;
  });

  await page.close();
  const list = [];
  console.log('全部标签', tagList);
  // 遍历标签
  for (let i = 0, l = tagList.length; i < l; i++) {
    let res = await findListByTag(tagList[i], browser);
    list.push(...res);
    console.log(tagList[i], 'ok')
  }

  // 暂时列表到文件
  fs.writeFileSync(`./all.json`, JSON.stringify(list), 'utf-8');
  console.log('文件path 写入完成');
  return list;
}

// 下载code
async function createMKDownFiles(browser) {
  const page = await browser.newPage();
  const list = require('../all.json');
  let downloadedList = [];

  for (let i = 480, l = list.length; i < l; i++) {
    let item = list[i];
    let downloaded = downloadedList.includes(item.id);

    if (!downloaded) {
      downloadedList.push(item.id);
    }

    // 重复分类跳过
    if (downloaded) continue;
    await page.goto(`https://leetcode-cn.com/${item.href}`);
    await sleep(2000);

    const question = await page.evaluate(() => {
      let inner = '';
      try {
        inner = document
          .querySelector('.content__2ebE>div')
          .getAttribute('html');
      } catch (e) {
        //
      }
      return inner;
    });

    // 写入文件
    if (question) {
      fs.writeFileSync(
        `./docs/leetcode/${item.id}.md`,
        await template(item, question),
        'utf-8'
      );
      console.log('write ok', item.id);
    } else {
      // not free
    }
  }
  await page.close();
}

// 创建菜单配置文件
async function createSilder() {
  let list = require('../all.json');
  let slider = [];
  let notFree = [];

  list.forEach(val => {
    let exit = fs.existsSync(`./docs/leetcode/${val.id}.md`);
    if (exit) {
      let item = slider.find(v => (v.title === val.name));
      let path = `/leetcode/${val.id}.md`;
      if (item) {
        item.children.push(path);
      } else {
        slider.push({
          title: val.name,
          collapsable: true,
          children: [path]
        });
      }
    } else {
      notFree.push(val);
    }
  });

  if (notFree.length) {
    slider.push('/not-free.md');
    let text = notFree.map(val => {
      let path = `https://leetcode-cn.com${val.href}`;
      return `### ${val.id} ${val.title}\n <a href="${path}">${path}</a>`
    }).join('\n')
    fs.writeFileSync('./docs/not-free.md', `### 收费题目\n ${text}`, 'utf-8')
  }
  fs.writeFileSync('./docs/.vuepress/code.json', JSON.stringify(slider), 'utf-8');
}



async function download(url, fileName) {
  let fileType = url.match(/\.([A-z]+)$/)[1];
  let stream = fs.createWriteStream(path.join(__dirname, '../', fileName));
  await new Promise((rs, rj) =>
    request(url)
      .pipe(stream)
      .on('close', () => {
        console.log(`${fileName}下载成功`);
        rs();
      })
  );
}

async function template({ id, title, hard, pt }, code) {
  let files = [];
  code = code.replace(/src="([^"]+)"/g, (word, $1) => {
    const fileType = $1.match(/\.([A-z]+)$/)[1];
    const fileName = `${+new Date()}.${fileType}`;
    const path = `./docs/.vuepress/public/images/`;
    files.push({
      src: $1,
      file: path + fileName
    });
    return `src="/images/${fileName}"`;
  });

  await Promise.all(
    files.map(async val => {
      return await download(val.src, val.file);
    })
  );

  return `# ${id}. ${title} \n \

\`\`\`难度：${hard}   通过率：${pt}\`\`\`

## 题目

${code}

## 答案

语言：

代码：

  `;
}

async function findListByTag({ name, path }, browser) {
  const page = await browser.newPage();

  await page.goto(
    `https://leetcode-cn.com/problemset/algorithms/?topicSlugs=${path}`
  );
  await sleep(3000);
  const list = await page.evaluate(() => {
    const list = document.querySelectorAll('.reactable-data tr');
    const val = [].slice.call(list, 0).map(val => {
      return {
        id: val.querySelector('td:nth-child(2)').innerHTML,
        title: val.querySelector('td div a').innerHTML,
        href: val.querySelector('td div a').getAttribute('href'),
        hard: val.querySelector('td .round').innerHTML,
        pt: val.querySelector('td:nth-child(5)').innerHTML
      };
    });

    return val;
  });
  page.close();
  return list.map(val => {
    return {
      ...val,
      name,
      path
    };
  });
}

async function sleep(timer) {
  return new Promise((rs, rj) => {
    setTimeout(() => {
      rs();
    }, timer);
  });
}

!async function() {
  await start();
}()
