const { parse } = require('@typescript-eslint/parser');
const fs = require('fs');

const myCustomProcessor = function (text, filePath) {
  const ast = parse(text, { sourceType: 'module' });
  const imports = [];

  ast.body.forEach((node) => {
    if (node.type === 'ImportDeclaration') {
      imports.push({ filePath, import: node.source.value });
    }
  });

  console.log(`Imports in ${filePath}:`, imports);

  return {
    text: text,
    filePath: filePath,
  };
};

const plugin = {
  meta: {
    name: 'eslint-plugin-fsd-pure',
    version: '0.1.0',
  },
  configs: {},
  rules: {},

  processors: {
    '.ts': myCustomProcessor,
    '.tsx': myCustomProcessor,
    '.js': myCustomProcessor,
    '.jsx': myCustomProcessor,
  },
};

// for ESM
export default plugin;

// OR for CommonJS
module.exports = plugin;
