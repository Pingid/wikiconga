const axios = require('axios');
const R = require('ramda');

const { default:Poem } = require('../src/utils/poem')
const { prisma } = require('../database/client');

const getRandomWikiPage = () => axios.get('https://kmo5ch0uh5.execute-api.eu-west-2.amazonaws.com/dev/random')
    .then(x => x.data)
    .catch(error => { console.log(error); return getRandomWikiPage() })

const getPoem = (url) => new Promise((resolve, reject) => {
    try {
        const newPoem = new Poem('firstRepeat');
        newPoem.build(url, 100)
        newPoem.on('done', resolve)
        newPoem.on('error', reject)
    } catch(error) { reject(error) }
   
})

const buildCreateNest = (lines) => {
    if (!R.head(lines)) return null;
    const { link, text, title } = R.head(lines);
    const url = link;
    return {
        connect: { url },
        create: { url, text, title, children: buildCreateNest(R.tail(lines)) }
    }
}

const buildUpsertNest = (lines) => {
    if (!R.head(lines)) return null;
    const { link, text, title } = R.head(lines);
    const url = link;
    return {
        upsert: [{
            where: { url },
            update: { url, title, text, children: buildUpsertNest(R.tail(lines)) },
            create: { url, title, text, children: buildCreateNest(R.tail(lines)) }
        }]
    }
}

const main = async () => {
    while (true) {
        const url = await getRandomWikiPage()
            .then(async url => {
                const exists = await prisma.wikicongaNode({ url });
                if (exists) return getRandomWikiPage();
                return url
            })

        const lines = await getPoem(url)
            .then(data => data.lines.reverse())
            .then(lines => R.contains(R.prop('link', R.head(lines)), R.map(R.prop('link'), lines)) ? R.tail(lines) : lines);

        const added = await Promise.all(lines.map(node => {
            return prisma.upsertWikicongaNode({
                where: { url: node.link },
                update: { url: node.link, title: node.title, text: node.text },
                create: { url: node.link, title: node.title, text: node.text }
            })
        }))

        const connections = await Promise.all(added.map((node, i) => {
            const child = added[i + 1];
            if (child) {
                return prisma.updateWikicongaNode({
                    where: { url: node.url },
                    data: { children: { connect: { url: child.url } } }
                })
            }
        }))
    }
}

// const deletAll = () =>
//     prisma.wikicongaNodes()
//         .then(x => Promise.all(x.map(y => prisma.deleteWikicongaNode({ id: y.id }))));

// deletAll()
main();