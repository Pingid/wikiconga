const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { default:Poem } = require('./src/utils/poem');

const updateFile = async (update, file) => {
    if (!fs.existsSync(file)) { fs.writeFileSync(file, '[]', 'utf8'); }
    const current = JSON.parse(fs.readFileSync(file, 'utf8'));
    const updated = update(current);
    const out = fs.writeFileSync(file, JSON.stringify(updated), 'utf8')
    return updated;
  }

const findLoop = ([head, ...tail]) => {
    if (tail.length < 1) return null;
    const exists = tail.filter(x => x.link === head.link);
    if (exists && exists[0]) return tail;
    return findLoop(tail);
}

const main = async () => {
    const url = await axios.get('https://dld7d563bh.execute-api.eu-west-2.amazonaws.com/dev/random').then(x => x.data);

    const lines = await new Promise((resolve) => {
        const newPoem = new Poem('firstRepeat');
        newPoem.build(url)
        newPoem.on('done', state => resolve(state.lines))
    })

    const loop = findLoop(lines)
    
    if (!loop) { console.log(lines); return main() }

    console.count('iteration');

    await updateFile(data => {
        const exists = data.filter(x => x[0].title === loop[0].title);
        if (exists && exists[0]) return data;
        console.log(loop.map(x => x.text).join('\n'))
        console.log('\n\n\n')
        return [...data, loop]
    }, path.resolve(__dirname, './loops.json'))
    
    return main();
}

main();