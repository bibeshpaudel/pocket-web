
const formatXml = (xml) => {
    xml = xml.replace(/(>)\s*(<)/g, '\\');
    xml = xml.replace(/(>)(<)(\/*)/g, '\\r\n\\');
    let formatted = '';
    let pad = 0;
    xml.split('\r\n').forEach((node) => {
      let indent = 0;
      if (node.match(/^<\/\w/)) {
        if (pad !== 0) { pad -= 1; }
      } else if (node.match(/^<\w[^>]*\/>$/) || node.match(/^<\?xml.*\?>$/) || node.match(/^<!--.*-->$/)) {
        indent = 0;
      } else if (node.match(/^<\w[^>]*>.*<\/\w[^>]*>$/)) {
        indent = 0;
      } else if (node.match(/^<\w[^>]*.*>$/)) {
        indent = 1;
      }
      let padding = '';
      for (let i = 0; i < pad; i++) { padding += '  '; }
      formatted += padding + node + '\n';
      pad += indent;
    });
    return formatted.trim();
};
console.log(formatXml('<root><child>text</child><child2/></root>'));

