interface TreeNode {
    [childrenKey: string]: TreeNode[]
}

const traverse = (childrenKey: keyof TreeNode, f: (x: TreeNode, depth: number) => void, nodes: TreeNode[], depth: number = 0): void => {
    nodes.forEach(node => {
        f(node, depth);
        if (node && node[childrenKey]) { traverse(childrenKey, f, node[childrenKey], depth+1) }
    })
}

const map = (childrenKey: keyof TreeNode, f: (x: TreeNode) => TreeNode, nodes: TreeNode[]): TreeNode[] => {
    return nodes.map(node => {
        const ret = f(node);
        if (!ret || !ret[childrenKey]) return ret;
        return { ...ret, [childrenKey]: map(childrenKey, f, ret[childrenKey]) }
    })
}

const reduce = <T>(childrenKey: keyof TreeNode, f: (a: T, b: TreeNode) => T, init: T, nodes: TreeNode[]) => {
    let ret = init;
    traverse(childrenKey, (node) => { ret = f(ret, node) } , nodes);
    return ret;
}

exports.traverse = traverse;
exports.map = map;
exports.reduce = reduce;