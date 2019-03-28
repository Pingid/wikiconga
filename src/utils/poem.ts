import axios from 'axios'
import * as R from 'ramda';

// 
function escapeRegExp(s: string): string { return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') }

// Get text up until word
const getTextUntil = (text: string, word: string): string => 
	new RegExp(`^.*?${escapeRegExp(word)}`, 'gi').exec(text)[0];

const getData = async (url: string): Promise<{ title: string, text: string, links: [{}] }> => {
	// Get Paragraph and links data
	const { data } = await axios({ url: `https://kmo5ch0uh5.execute-api.eu-west-2.amazonaws.com/dev/page?url=${url}` });

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

interface stateData { start: string, lines: string[], visited: string[], pages: object[] }

export default class Poem {
	type: string;
	paused: boolean;
	finished: boolean;
	state: stateData;
	
	constructor(type: string) { this.type = type; }
	setState(x: object, event: string = '') {
		this.state = Object.assign({}, this.state, x) // Update State object
		this[event] && this[event](this.state[event]) // Triggor State Event
		this.finished = false;
		this.paused = false;
	}

	// Events
	on(event: string, f: (n: any) => void): void { this[event] = f; } // Event event listener
	finish(): void { if (this['done']) { this['done'](this.state) } this.finished = true; }
	build(...args): void { return this[this.type](...args) }

	// Data
	getState(): stateData { return this.state }

	// Follow links until first repeat
	async firstRepeat(url: string, limit = 30) {
		this.state = { start: url, lines: [], visited: [], pages: [] };

		const recurseBuild = async (link) => {
			const { visited, lines, pages } = this.state
			const data = await getData(link);
			const { text, links, title } = data;
			const next = R.head(links);
			if (!next || visited.length > limit || R.contains(link, visited) || this.finished) return this.finish();
			this.setState({
				pages: R.append(data, pages),
				visited: R.append(link, visited),
				lines: R.append({ title, text: getTextUntil(text, next.text), link: next.link }, lines)
			}, 'lines')
			return !this.finished && recurseBuild(next.link)
		}

		return await recurseBuild(url);
	}

	// Follow links until limit or reach page with no new links
	async ignoreRepeats(url: string, limit = 30) {
		this.state = { start: url, lines: [], visited: [], pages: [] };
		const recurseBuild = async (link) => {
			const { visited, lines, pages } = this.state
			const data = await getData(link);
			const { text, links } = data;
			const next = R.head(links.filter((x: { link: string }) => !R.contains(x.link, visited)));
			if (!next || visited.length > limit || this.finished) return this.finish();
			this.setState({
				pages: R.append(data, pages),
				visited: R.append(link, visited),
				lines: R.append({ text: getTextUntil(text, next.text) }, lines)
			}, 'lines')
			return !this.finished && recurseBuild(next.link)
		}

		return await recurseBuild(url);
	}

}
