import markdownLinkExtractor from 'markdown-link-extractor';
import { createUtils } from 'next-mdx-relations';

export const { getPages, getPaths, getPageProps } = createUtils({
  content: '../content',
  metaGenerators: {
    mentions: node => {
      const links = markdownLinkExtractor(node.content)?.links;
      return links?.filter((l: string) => l[0] === '/');
    }
  },
  relationGenerators: {
    mentionedIn: (node, _, nodes) =>
      nodes.filter(n =>
        n?.meta?.mentions.includes(`/${node.params.slug.join('/')}`)
      ),
    reverseSort: {
      transform: nodes => nodes.reverse(),
      map: (node, index, array) => {
        const prev = index > 0 ? array[index - 1] : null;
        const next = index < array.length - 1 ? array[index + 1] : null;
        return {
          prev,
          next
        };
      }
    }
  }
});
