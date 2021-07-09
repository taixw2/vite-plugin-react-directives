import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import reactDirectives from 'babel-plugin-react-directives';

const fileRegex = /\.(t|j)sx?$/;

export default function reactDirectivesPlugin() {
  return {
    name: 'react-directives',

    transform(code, path) {
      if (!fileRegex.test(path)) return code;
      const ast = parser.parse(code, {sourceType: 'module', plugins: ['jsx', 'typescript']});

      const {visitor} = reactDirectives({ version: '7.0.0' })
      traverse(ast, visitor, undefined, {});

      const output = generate(ast);
      return output.code;
    },
  };
}
