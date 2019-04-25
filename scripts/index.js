const axios = require('axios');

const main = async (n) => {
    while (true) {
        await Promise.all(Array.from(new Array(n)).map(x => axios.get('https://nlesax73nf.execute-api.eu-west-2.amazonaws.com/dev/wikiconga').catch(x => null)))
    }
}

main(100);