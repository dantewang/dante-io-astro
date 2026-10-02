# dante.io

个人主页（`/`）与博客（`/blog/`），基于 [Astro](https://astro.build)，静态输出，部署在 Cloudflare Pages。

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # 输出到 dist/
```

## 配置

站点内容在 `astro.config.mjs` 的 `siteConfig({...})` 里：

| 字段 | 作用 |
| --- | --- |
| `links` | 首页链接列表，也是博客顶栏导航（`{ label, url, note?, newTab? }`） |
| `tagline` | 首页 HELLO I'M DANTE 下面那段话 |
| `blog.intro` | 博客首页 BLOG 下面那段话 |
| `blog.pageSize` | 列表每页文章数（博客首页和各标签页） |
| `blog.timezone` | 显示日期用的时区（构建机在 UTC） |

文字字段支持一点行内标记：`**高亮**`、`==强调色==`（初音青）、`[链接](url)`。

## 写文章

在 `src/content/blog/` 新建 `<slug>.md`，文件名就是 URL（`/blog/<slug>/`，不要用 `page`、`tags`）：

```markdown
---
title: "标题"
date: 2026-10-02T20:00:00+08:00
tags: ["java", "jvm"]
description: "可选，列表和 RSS 里的摘要"
lang: en          # 可选，正文是英文时
draft: true       # 可选，只在 npm run dev 里显示
---

正文……
```

中文排版相关：中文之间的换行不会变成空格；`**加粗**` 紧贴中文标点也能生效；代码块语言大小写不敏感。

## 从 Memos 导入

```bash
node scripts/import-memos.mjs            # 只导入新的公开 memo
node scripts/import-memos.mjs --force    # 覆盖已导入的
```

读取 memos.dante.io 的公开内容（无需 token）：第一行 `# 标题` 作为标题，末尾的标签行转成 `tags`（忽略 `#blog`），日期用 memo 的创建时间（按 `Asia/Shanghai`）。导入后可以随意改文件名，脚本靠 frontmatter 里的 `memo:` 字段识别，不会重复导入。

## 部署（Cloudflare Pages）

- Build command：`npm run build`
- Build output directory：`dist`
- Node 版本由 `.node-version` 指定（Astro 需要 ≥ 22.12）
