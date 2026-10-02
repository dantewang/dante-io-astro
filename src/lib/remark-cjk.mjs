// Markdown fixes for Chinese text, as a remark plugin.
//
// 1. A soft line break between two CJK characters becomes a space in HTML
//    (browsers don't drop it the way they do for Latin text), so
//    "第一行\n第二行" would read "第一行 第二行". Drop those line breaks.
// 2. Normalise code fence languages to lower case ("```Java" -> "java") so
//    Shiki recognises them; Memos accepts either.

const CJK = /[⺀-⿟　-〿぀-ヿ㄀-ㄯ㆐-ㇿ㐀-䶿一-鿿豈-﫿︰-﹏＀-￯]/;
const CJK_NEWLINE = new RegExp(`(${CJK.source})[ \\t]*\\n[ \\t]*(?=${CJK.source})`, 'g');

/** last / first character of a node's text, looking through inline children */
const edgeChar = (node, last) => {
  if (!node) return '';
  if (typeof node.value === 'string') return last ? node.value.slice(-1) : node.value.charAt(0);
  const kids = node.children ?? [];
  return edgeChar(last ? kids[kids.length - 1] : kids[0], last);
};

export default function remarkCjk() {
  return tree => {
    const walk = node => {
      if (node.type === 'code' && node.lang) node.lang = node.lang.toLowerCase();
      const kids = node.children;
      if (!kids) return;
      kids.forEach((child, i) => {
        if (child.type === 'text') {
          child.value = child.value.replace(CJK_NEWLINE, '$1');
          // a line break right at the edge of the node, e.g. "**粗体**\n正文"
          if (/^[ \t]*\n/.test(child.value) && CJK.test(edgeChar(kids[i - 1], true)) && CJK.test(child.value.replace(/^\s+/, '').charAt(0))) {
            child.value = child.value.replace(/^\s+/, '');
          }
          if (/\n[ \t]*$/.test(child.value) && CJK.test(child.value.replace(/\s+$/, '').slice(-1)) && CJK.test(edgeChar(kids[i + 1], false))) {
            child.value = child.value.replace(/\s+$/, '');
          }
        }
        walk(child);
      });
    };
    walk(tree);
  };
}
