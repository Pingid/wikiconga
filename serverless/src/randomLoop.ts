import { APIGatewayProxyHandler } from 'aws-lambda';

import poem from './utils/generatePoem';
import getRandomWikiPage from './utils/getRandomWikiPage';
import { PoemLine } from './utils/types'
import addPoemToDatabase from './utils/addPoemToDatabase';

const randomLoop: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const url = await (() => {
      if (event.body && JSON.parse(event.body).url) return JSON.parse(event.body).url;
      if (event.queryStringParameters && event.queryStringParameters.url) return event.queryStringParameters.url;
      return getRandomWikiPage();
    })()
    const newPoem: PoemLine[] = await poem(url);

    await addPoemToDatabase(newPoem)
    
    return { statusCode: 200, body: JSON.stringify(newPoem) };
  } 
  catch (error) { 
    console.log('ERROR', error);
    return { statusCode: 200, body: error.message, }; 
  }
}

export default randomLoop;