const axios = require('axios');
const R = require('ramda');

const buildLinksTree = require('./links-tree');
const { reduce:treeReduce } = require('./tree-utils')
const { default:Poem } = require('../src/utils/poem')
const { updateFile, onFile } = require('./async-utils');

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

const buildTree = (key) => (arr, tree) => {
    if (arr.length <= 0) return tree;
    const nextNode = R.head(arr);
    const existing = R.find(x => x[key] === nextNode[key], tree);

    if (existing) return [
        { ...existing, parents: buildTree(key)(R.tail(arr), existing.parents) },
        ...R.filter(x => x[key] !== nextNode[key], tree)
    ];

    return [
        { ...R.head(arr), parents: buildTree(key)(R.tail(arr), []) },
        ...tree
    ]
}

const GenerateFromRandom = async (dataPath, logPath) => {
    while (true) {
        await updateFile(async tree => {
            const url = await getRandomWikiPage()
                .then(x => onFile(data => R.find(y => y === 'cool', data), logPath).then(y => y ? getRandomWikiPage() : x))
            await updateFile(data => [...data, url ], logPath);

            console.log(url)

            const { lines } = await getPoem(url).catch(err => { console.log('Error building poem'); throw new Error(err); });
            const newTree = buildTree('title')(lines.reverse(), tree)
            return newTree;
        }, dataPath)
    }
}

const generateFromLinks= async (dataPath, links) => {
    await Promise.all(links.map(async link => {
        const { lines } = await getPoem(link).catch(err => { console.log('Error building poem'); throw new Error(err); });
        await updateFile(async tree => buildTree('title')(lines.reverse(), tree), dataPath)
    }))
}




// console.time("philosophy-depth-10");

// buildLinksTree(2, 10, 'Philosophy')
//     .then(x => treeReduce('children', (a, b) => [...a, b.link], [], [x]))
//     .then(x => x.filter(x => x))
//     .then(links => generateFromLinks(__dirname + '/data/poemTreePhilosophyLinks.json', links))

// console.timeEnd("philosophy-depth-10");
GenerateFromRandom(__dirname + '/data/randomTree.json', __dirname + '/data/visited.json')

