import rss from '@astrojs/rss';
import { excerpt, getPosts, postUrl } from '../lib/posts';

export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: 'dante.io',
    description: '关于 JVM、性能调优、Java 基础设施，以及偶尔的二次元与游戏。',
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
