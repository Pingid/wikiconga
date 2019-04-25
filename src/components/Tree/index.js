import React from 'react'
import Tree from 'react-d3-tree';
import * as R from 'ramda';

const transformNodes = tree => {
    if (!Array.isArray(tree)) return tree;
    return tree.map(x => ({
        name: x.title,
        _collapsed: true,
        attributes: { link: x.link, description: x.text },
        children: transformNodes(x.parents)
    }))
}

const mapTree = (childrenKey, f, nodes) => {
    return nodes.map(node => {
        const ret = f(node);
        if (!ret || !ret[childrenKey]) return ret;
        return { ...ret, [childrenKey]: mapTree(childrenKey, f, ret[childrenKey]) }
    })
}


const wikiTree = require('./tree.json')
const linksToTree = require('./linksToPhilosophy.json')
const poemTreePhilosophyLinks = require('./poemTreePhilosophyLinks.json')

const collapse = data => mapTree('children', node => ({ 
    ...node,
    name: node.title,
    _collapsed: true
}), data);

console.log(collapse([linksToTree]))


const myTreeData = {
    name: 'Wikiconga',
    attributes: { description: 'Graph the wikiconga connections' },
    children: transformNodes(poemTreePhilosophyLinks)
}

const svgSquare = {
    shape: 'circle',
    shapeProps: {
        cx:0,
        cy:0,
        r: 5,
        fill: 'black'
    }
  }

const NodeLabel = ({ nodeData }) => {
    return (
        <div>
            <p className="ma0 b pb3">{nodeData.name}</p>
            {(nodeData.attributes && nodeData.attributes.description && nodeData.name !== nodeData.attributes.description) && <p className="ma0">{nodeData.attributes.description}</p>}
        </div>
    )
}

const TreePage = () => {
    const translate = (() => {
        if (typeof window !== 'undefined') return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        return { x: 0, y: 0}
    })()
    return (
        <div className="" style={{ width: '100vw', height: '100vh'}}>
            <Tree 
                allowForeignObjects
                useCollapseData
                collapsible
                data={myTreeData} 
                initialDepth={1}
                transitionDuration={0}
                translate={translate}
                nodeLabelComponent={{
                    render: <NodeLabel />,
                    foreignObjectWrapper: { y: -35, x: -10, height: 200 }
                }}
                separation={{ siblings: .8, nonSiblings: 1 }}
                nodeSize={{ x: 200, y: 200 }} 
                nodeSvgShape={svgSquare}
                styles={{
                    nodes: {
                        node: {
                        attributes: { stroke: 'blue' },
                        },
                        leafNode: {
                        attributes: { stroke: 'blue' },
                        },
                    },
                    }}
            />
        </div>
    )
}

export default TreePage
