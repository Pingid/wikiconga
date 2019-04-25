const { retry } = require('./async-utils');
const axios = require('axios');
const ProgressBar = require('progress');

const linksHere = (title, limit=10) => retry(10)(() => axios.get(`https://kmo5ch0uh5.execute-api.eu-west-2.amazonaws.com/dev/whatlinkshere?target=${title}&limit=${limit}`).then(x => x.data));

const buildLinksTree = (childLimit, depth, startTitle) => {
    let bar = new ProgressBar(':bar', { total: Math.pow(childLimit, depth) });

    const recurseBuild = async (acc, node) => {
        bar.tick()
        if (acc >= depth) return { ...node };
        return {
            ...node,
            children: await linksHere(node.title, childLimit)
                .then(nodes => Promise.all(nodes.map(childNode => recurseBuild(acc + 1, childNode))))
        }
    }
    return recurseBuild(0, { title: startTitle })
}

module.exports = buildLinksTree;

// buildLinksTree(2, 11, 'Philosophy')
//     .then(linksHereTree => updateFile(data => linksHereTree, __dirname + '/data/linksToPhilosophy.json'))

