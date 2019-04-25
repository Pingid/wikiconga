import { prisma, WikicongaNode } from '../../prisma-client';
import { PoemLine } from './types'
import * as R from 'ramda';

export default async (poem: PoemLine[]): Promise<WikicongaNode> => {
    const lines = poem.reverse();
    
    if (lines.filter(x => !x.link).length > 0) { 
        return Promise.reject('Missing link in ' + JSON.stringify(lines.filter(x => !x.link)));
    }

    // Add to Database
    const added: WikicongaNode[] = await Promise.all(lines.map(node => {
        return prisma.upsertWikicongaNode({
            where: { url: node.link },
            update: { url: node.link, title: node.title, text: node.text },
            create: { url: node.link, title: node.title, text: node.text }
        })
    }))

    await Promise.all(added.map((node, i) => {
        const child = added[i + 1];
        if (child) {
            return prisma.updateWikicongaNode({
                where: { url: node.url },
                data: { children: { connect: { url: child.url } } }
            })
        }
    }))

    return R.last(added);
}