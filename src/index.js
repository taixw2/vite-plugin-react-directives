import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import t from '@babel/types';
import camelcase from 'camelcase';

const fileRegex = /\.(t|j)sx?$/;
const flag = '___src2import_'

let collectImports = [];


export default function Src2Import() {
  return {
    name: 'src2import',

    transform(code, path) {
      if (!fileRegex.test(path)) return code;

      const ast = parser.parse(code, {sourceType: 'module'});


      traverse(ast, {
        ObjectProperty(path) {
          if (!t.isIdentifier(path.node.key, {name: 'src'}) || !t.isStringLiteral(path.node.value)) {
            return;
          }

          const {value} = path.node.value;
          if (/^\w+:\/\//.test(value)) {
            return;
          }

          const ident = t.identifier(flag + camelcase(value.replace(/\//g, ' ')));
          if (!collectImports.some(item => item[1] === value)) {
            collectImports.push([ident, value]);
          }
          path.node.value = ident;
        },
        Program: {
          enter() {
            collectImports = [];
          },
          exit(path) {
            path.unshiftContainer(
              'body',
              collectImports.map(([ident, path]) => {
                return t.importDeclaration([t.importDefaultSpecifier(ident)], t.stringLiteral(path));
              }),
            );
          },
        },
      });
      const output = generate(ast);
      return output.code;
    },
  };
}
