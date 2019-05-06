import React from 'react';
import axios from 'axios';
import classNames from 'classnames';
import styled from 'styled-components';
import AsyncSelect from 'react-select/lib/Async';

const Wrapper = styled.div`
  margin-left: 20vw;
  max-width: 30rem;
  @media (max-width: 500px) {
    max-width: 100%;
    margin-left: 0;
    padding-left: 1rem;
  }
`;

let lastInputValue = '';
const loadOptions= (inputValue: string, callback: (x: []) => void): Promise<{ value: string, label: string }[]> => {
    lastInputValue = inputValue;
    if (inputValue.length > 0) {
        return axios.get(`https://dld7d563bh.execute-api.eu-west-2.amazonaws.com/dev/search?search=${inputValue}`)
            .then(({ data }) => lastInputValue === inputValue ? data : null)
            .then((data) => data && data[1].map((title, i) => ({
                title,
                description: data[2][i],
                link: data[3][i]
            })))
            .then((data) => data.map(x => ({ ...x, value: x.title, label: x.title })))
    }
    return Promise.resolve([opts]);
}

interface state { url?: string, title?: string, poemURL?: string; };
interface Search extends state { 
    setState: (s: state) => void;
    onSearch: (str: string) => void;
}

const Search: React.FC<Search> = ({ poemURL, title, url, setState }) => {

    const handleChangeTitle = (newValue: string, { action }) => action === 'input-change' && setState({ title: newValue  });
    const handleSelectSuggestion = (x) => {
        if (x.value === 'Random') {
            return axios.get('https://dld7d563bh.execute-api.eu-west-2.amazonaws.com/dev/random')
                .then(x => setState({ url: x.data, title: 'Random' }))
        }
        return setState({ url: x.link, title: x.title  });
    }
    const handleSubmit = e => { e.preventDefault(); setState({ poemURL: url }) };

    const buttonValid = (poemURL !== url);

    return (
        <Wrapper className="border border-black w-full pr3">
            <form className="flex flex-wrap" onSubmit={handleSubmit}>
                <small className="w-100"><input
                    className="bw0 w-100 pl2 pv2 o-40"
                    disabled={true}
                    type="text" 
                    placeholder="https://en.wikipedia.org/wiki/Oulipo"
                    value={url} /></small>
                <AsyncSelect
                    key={`my_unique_select_key__${buttonValid}`}
                    className="w-100"
                    allowCreateWhileLoading
                    cacheOptions
                    placeholder="search wikipedia"
                    inputValue={title}
                    defaultOptions={[{ value: 'Random', label: 'Random' }]}
                    loadOptions={loadOptions}
                    onInputChange={handleChangeTitle} 
                    onChange={handleSelectSuggestion}
                    styles={{ control: (provided, state) => ({ ...provided, boxShadow: 'none', border: '1px solid black' }) }}
                    theme={(theme) => ({ ...theme, borderRadius: 0, colors: { ...theme.colors, primary: 'black', }, })}
                />
                <button type="submit" className={classNames('pa2 ba pointer mv2', { 'ba b--black hover-blue': buttonValid, 'o-20 bg-white black': !buttonValid })}>
                    generate
                </button>
            </form>
        </Wrapper>
    )
}

export default Search;