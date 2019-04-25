import axios from 'axios'
import * as R from 'ramda';

import { PoemLine } from './types';

function escapeRegExp(s: string): string { return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') }

// Get text up until word
const getTextUntil = (text: string, word: string): string => 
	new RegExp(`^.*?${escapeRegExp(word)}`, 'gi').exec(text)[0];

const getData = async (url: string): Promise<{ title: string, text: string, links: [{}] }> => {

	// Get Paragraph and links data
	const { data } = await axios({ 
		method: 'POST', 
		url: `https://kmo5ch0uh5.execute-api.eu-west-2.amazonaws.com/dev/page`,
		data: { url }
	});

	// Remove anything inside parenthesis and newlines in paragraphs
	const text = data.paragraphs.join('\n')
		.trim()
		.replace(/\[.*?\]/gmi, '')
		.replace(/\([^()]*\)/gmi, '').replace(/\([^()]*\)/gi, '').replace(/\([^()]*\)/gi, '')
		.replace(/\n/gmi, '')

	// Clean and sort links
	const cleanLinks = R.compose(
		R.flatten,
		R.map(x => R.sort((a, b) => text.indexOf(a.text) - text.indexOf(b.text), x)),
		R.splitEvery(10),
		R.filter(x => text.indexOf(x.text) > 0),
		R.filter(x => !/#|Category:|\.jpg|php|Help:|File:/.test(x.link))
	)

	return { ...data, text, links: cleanLinks(data.links) }
}

// Wikiconga stop at first repeat
const firstRepeat = (url: string, limit: number = 1000): Promise<PoemLine[]> => {
	const recurse = (link: string, lines: PoemLine[]): Promise<PoemLine[]> => getData(link)
		.then(({ text, links, title }) => {
			const next = R.head(links);
			if (!next || lines.length > limit || R.contains(next.link, lines.map(R.prop('link')))) return lines;
			return recurse(
				next.link,
				R.append({ title, text: getTextUntil(text, next.text), link: next.link }, lines)
			)
		})
	return recurse(url, []);
}

export default firstRepeat;