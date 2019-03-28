const axios = require('axios');

const main = async () => {
    const url = "https://en.wikipedia.org/wiki/Category:2009_deaths";
    const { data } = await axios({ url: `http://localhost:1234/?adress=https://kmo5ch0uh5.execute-api.eu-west-2.amazonaws.com/dev/page?url=${url}` });
    console.log(data);
}


const category = async () => {
    const url = '2009 endings';
    const { data } = await axios({ url: `http://localhost:1234/?adress=https://kmo5ch0uh5.execute-api.eu-west-2.amazonaws.com/dev/categorytree?category=${url}` });
    console.log(data);
}
main();