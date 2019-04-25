import React, { useEffect } from 'react';
import radialTreeD3 from '../utils/radialTreeD3';
import tree from './Tree/tree.json';
import { map } from '../utils/tree-utils';

const RadialTreeD3 = () => {
    useEffect(() => {
        const mapped = map('children', (node) => {
            return { name: node.title, children: node.parents }
        }, tree)
        console.log(mapped)
        radialTreeD3(mapped);
    })
    return (
        <div>
        </div>
    )
}

export default RadialTreeD3;