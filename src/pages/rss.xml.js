import rss from '@astrojs/rss';
import site from 'virtual:site-config';
import { plain } from '../lib/inline';
import { excerpt, getPosts, postUrl } from '../lib/posts';

export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: 'dante.io',
    description: plain(site.blog.intro),
    site: context.site,
    items: posts.map(p => ({
      title: p.data.title,
      pubDate: p.data.date,
      description: excerpt(p, 200),
      link: postUrl(p),
      categories: p.data.tags,
    })),
    customData: '<language>zh-cn</language>',
  });
}
