import React, { useState, useEffect } from 'react';
import * as R from 'ramda';
import { traverse } from '../../utils/tree-utils';

const handleDrag = () => {
    const [position, setposition] = useState({ x: 0, y: 0 });
    const [last, setlast] = useState(null);
    const [down, setdown] = useState(null);

    const handleDown = (e) => { setlast(position); setdown({ x: e.clientX, y: e.clientY }) }
    const handleUp = () => setdown(null)
    const handleMove = (e) => {
        if (down) {
            setposition({ 
                x: (e.clientX - down.x) + last.x,
                y: (e.clientY - down.y) + last.y
            })
        }
    }

    useEffect(() => {
        window.addEventListener('mousedown', handleDown)
        window.addEventListener('mouseup', handleUp)
        window.addEventListener('mousemove', handleMove);
        return () => {
            window.removeEventListener('mousedown', handleDown)
            window.removeEventListener('mouseup', handleUp)
            window.removeEventListener('mousemove', handleMove);
        }
    })

    return position;
}

const handleScale = (increment=0.1) => {
    const [scale, setscale] = useState(1);

    const handleScroll = (event) => 
        event.deltaY > 0 ? setscale(scale * (1 + increment)) : setscale(scale * (1 - increment));
    
    useEffect(() => {
        window.addEventListener("wheel", handleScroll);
        return () => window.removeEventListener("wheel", handleScroll);
    })

    return scale;
}

const rotate = (angle, point) => ({
    x: Math.cos(angle) * point.x - Math.sin(angle) * point.y,
    y: Math.sin(angle) * point.x + Math.cos(angle) * point.y
})

const translate = (to, point) => ({ x: to.x + point.x, y: to.y + point.y });

const arcPoints = (theta, radius, n) =>
    Array.from(new Array(n)).map((_, i) => rotate((i / (n - 1)) * theta, ({ x: 0, y: radius })) )

const CirclePoints = ({ pos, node, depth }) => {
    if (depth && depth > 5) return null;
    console.log(depth)
    return (
        <>
            <circle key={node.title} cx={pos.x} cy={pos.y} r="5" />
            <text x={pos.x} y={pos.y}>{node.title}</text>
            { node.children && node.children.map((x, i) => {
                const position = rotate((i / node.children.length) * Math.PI / 2, { x: 0, y: 100 })
                const translation = translate(pos, position);
                return <CirclePoints key={JSON.stringify(translation)} depth={depth ? (depth + 10) : 0} pos={translation} node={x} />
            })}
            {/* { arcPoints(Math.PI, 100, 2).map(point => <circle cx={point.x} cy={point.y} r="5" />)} */}
        </>
    )
}

const Graph = ({ radius, position, theta, offset, node, depth }) => {
    // if (depth && depth > 1) return null;
    let nextDepth = depth ? depth + 1 : 1;
    const nextRotation = i => ((1 / node.children.length) * theta) + ( Math.PI * 2 * offset );
    // console.log(nexwtRotation)
    return (
        <>
            <circle cx={position.x} cy={position.y} r="5" />
            <text x={position.x} y={position.y}>{node.title}</text>
            { node.children && node.children.map((x, i) => {
                const rotation = rotate((i / node.children.length) * Math.PI * 2, { x: 0, y: radius })
                const translation = translate(position, rotation);
                // const direction = 
                return (
                    <>
                        <line x1={position.x} y1={position.y} x2={translation.x} y2={translation.y} />
                        <Graph key={translation.x + '' + translation.y + Math.random()} {...{ radius: radius * .3, position: translation, theta, offset, node: x, depth: nextDepth }} /> 
                    </>
                )
                return 
            })}
        </>
    )
}

const words = 'kittens cast faded nose size spot equal vast sincere spectacular sense aquatic maniacal cow frog bulb plantation omniscient lamp nostalgic suppose penitent window shake voracious yard guarded class mailbox scissors fall deeply hydrant numberless frogs quince chalk icicle ultra van one acidic test ruin jagged team spotty travel ad hoc hypnotic blind carve answer important action descriptive pathetic disturbed instrument skillful necessary pencil flow friends listen truculent brave challenge beds excite changeable shelter line art sparkle hideous standing pumped cable flag straight itch overconfident skinny defeated wriggle hang accept ear embarrassed second-hand whole writing ajar quarter mute government industry sail examine sail robin useless zesty bruise account position thunder chew merciful trashy versed pushy discreet selection group spoil clover functional sigh';

const generateDummyData = (depth, children) => {
    const title =  words.split(' ')[Math.floor(Math.random() * words.split(' ').length)];
    if (depth <= 0) return { title };
    return { title, children: Array.from(new Array(children)).map((x, i) => generateDummyData(depth - 1, children)) }
}
const dummyData = generateDummyData(2, 5);

const CentricGraph = ({ radius, position, theta, offset, node, depth }) => {
    const getRings = (tree) => {
        let rings = {};
        traverse('children', (treeNode, ringDepth) => {
            rings = rings[ringDepth] ? ({ ...rings, [ringDepth]: [ ...rings[ringDepth], treeNode ] }) : ({ ...rings, [ringDepth]: [ treeNode ] });
        }, tree)
        return Object.values(rings);
    }

    const rotate = (angle, point) => ({
        x: Math.cos(angle) * point.x - Math.sin(angle) * point.y,
        y: Math.sin(angle) * point.x + Math.cos(angle) * point.y
    })
    
    const translate = (to, point) => ({ x: to.x + point.x, y: to.y + point.y });
    
    const arcPoints = (theta, radius, n) =>
        Array.from(new Array(n)).map((_, i) => rotate((i / (n - 1)) * theta, ({ x: 0, y: radius })) )

    const rings = getRings([node]);
    return (
        <>
            { 
                rings.map((ring, i) => {
                    const points = arcPoints
                })
            }
            <circle cx={position.x} cy={position.y} r="5" />
            {/* <text x={position.x} y={position.y}>{node.title}</text> */}
            { node.children && node.children.map((x, i) => {
                // const rotation = rotate((i / node.children.length) * Math.PI * 2, { x: 0, y: radius })
                // const translation = translate(position, rotation);
                // // const direction = 
                // return (
                //     <>
                //         <line x1={position.x} y1={position.y} x2={translation.x} y2={translation.y} />
                //         <Graph key={translation.x + '' + translation.y + Math.random()} {...{ radius: radius * .3, position: translation, theta, offset, node: x, depth: nextDepth }} /> 
                //     </>
                // )
                // return 
            })}
        </>
    )
}

const Tree = ({ data }) => {
    const translate = handleDrag();
    const scale = handleScale(0.03);

    const head = Array.isArray(data) ? data[0] : data;

    return (
        <div style={{ position: 'fixed', width: '100vw', height: '100vh' }}>
            <svg width="100%" height="100%" style={{ fill: 'black', stroke: 'back', strokeWidth: '2px' }}>
                <g transform={`translate(${translate.x}, ${translate.y}) scale(${scale})`}>
                <Graph {...({ radius: 100, position: { x: 0, y: 0, }, theta: 1, offset: 0, node: dummyData })} />
                <CentricGraph {...({ radius: 100, position: { x: 0, y: 0, }, theta: 1, offset: 0, node: dummyData })} />
                {/* <CirclePoints pos={{ x: 0, y: 0 }} node={head} /> */}
                    {/* <circle cx="10" cy="10" r="200" /> */}
                    {/* { generateGraphPoints(, head) } */}
                    {/* { arcPoints(Math.PI, 100, 2).map(point => <circle cx={point.x} cy={point.y} r="5" />)} */}
                </g>
            </svg>
        </div>
    )
}

export default Tree;