import markdownLinkExtractor from 'markdown-link-extractor';
import { createUtils } from 'next-mdx-relations';

export const { getPages, getPaths, getPageProps } = createUtils({
  content: '../content',
  metaGenerators: {
    mentions: node => {
      const links = markdownLinkExtractor(node.content)?.links;
      return links.filter((l: string) => l[0] === '/');
    }
  },
  relationGenerators: {
    mentionedIn: nodes =>
      nodes.map(node => ({
        ...node,
        meta: {
          ...node.meta,
          mentionedIn: nodes.filter(n =>
            n?.meta?.mentions.includes(`/${node.params.slug.join('/')}`)
          )
        }
      }))
  }
});
