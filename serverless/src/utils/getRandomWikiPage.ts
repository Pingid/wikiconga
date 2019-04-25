import axios from 'axios';

const getRandomWikiPage = (): Promise<string> => axios.get('https://kmo5ch0uh5.execute-api.eu-west-2.amazonaws.com/dev/random')
    .then(x => x.data)
    .catch(error => { console.log(error); return getRandomWikiPage() })

export default getRandomWikiPage;