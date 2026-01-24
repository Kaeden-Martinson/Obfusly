#!/usr/bin/env node
/**
 * obfuscate-rename.js
 *
 * Usage:
 *   node obfuscate-rename.js --in input.js --out out.js --map mapping.json [--props] [--prefix _x] [--seed 12345]
 *
 * - --props: attempt to mangle *safe* property names (object literal keys and non-computed dot access in same file)
 * - mapping.json: emitted mapping { originalName: newName, ... } for debugging (keep private)
 *
 * Notes / Caveats:
 * - Renaming is scope aware and will not break local bindings.
 * - Do NOT enable --props unless you understand the risk: cross-file property usage, computed access,
 *   reflective code, JSON keys, DOM APIs, or external libraries referencing property strings can break.
 * - Whitelist contains many common globals; extend it with any names your project relies on.
 */

const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const t = require('@babel/types');

const { generateObfuscatedName } = require('../../Utils/nameGenerator');

function astCode(code) {
  const MANGLE_PROPS = false;

  const GLOBAL_WHITELIST = new Set([
    'window', 'globalThis', 'global', 'self', 'process', 'require', 'module', 'exports', 'console', 'Buffer',
    'document', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'fetch', 'XMLHttpRequest',
    'Promise', 'URL', 'URLSearchParams', 'Math', 'JSON', 'Date', 'RegExp', 'Error', 'Map', 'Set', 'WeakMap', 'WeakSet',
    'TextEncoder', 'TextDecoder', 'btoa', 'atob', 'Intl', 'performance', 'localStorage', 'sessionStorage',
    '__OBFUSCATED_PLACEHOLER__', '__decodePayload'
  ]);

  const src = code;

  const ast = parser.parse(src, {
    sourceType: 'unambiguous',
    plugins: ['jsx', 'classProperties', 'dynamicImport', 'optionalChaining', 'nullishCoalescingOperator']
  });

  const mapping = {};
  const propMap = Object.create(null);

  if (MANGLE_PROPS) {
    traverse(ast, {
      ObjectExpression(path) {
        const props = path.node.properties;
        for (const p of props) {
          if (t.isObjectProperty(p) && !p.computed && t.isIdentifier(p.key)) {
            const orig = p.key.name;
            if (GLOBAL_WHITELIST.has(orig)) continue;
            // mark candidate
            if (!propMap[orig]) propMap[orig] = generateObfuscatedName(orig);
          } else if (t.isObjectProperty(p) && !p.computed && t.isStringLiteral(p.key)) {
            const orig = p.key.value;
            if (GLOBAL_WHITELIST.has(orig)) continue;
            if (!propMap[orig]) propMap[orig] = generateObfuscatedName(orig);
          }
        }
      }
    });
  }

  traverse(ast, {
    Scopable(path) {
      const scope = path.scope;
      Object.keys(scope.bindings).forEach(origName => {
        if (GLOBAL_WHITELIST.has(origName)) return;
        const binding = scope.bindings[origName];
        if (!binding) return;
        if (binding.path && binding.path.isExportNamedDeclaration()) return;
        if (binding.referenced && binding.constantViolations.length > 0) {
        }

        const newName = generateObfuscatedName(origName);
        try {
          scope.rename(origName, newName);
          mapping[origName] = newName;
        } catch (e) {
        }
      });
    },

    MemberExpression(path) {
      if (!MANGLE_PROPS) return;
      if (!path.node.computed && t.isIdentifier(path.node.property)) {
        const prop = path.node.property.name;
        if (propMap[prop]) {
          const obj = path.node.object;
          if (t.isIdentifier(obj) && GLOBAL_WHITELIST.has(obj.name)) return;
          path.get('property').replaceWith(t.identifier(propMap[prop]));
        }
      }
    },

    ObjectProperty(path) {
      if (!MANGLE_PROPS) return;
      if (!path.node.computed) {
        if (t.isIdentifier(path.node.key)) {
          const orig = path.node.key.name;
          const mapped = propMap[orig];
          if (mapped) path.get('key').replaceWith(t.identifier(mapped));
        } else if (t.isStringLiteral(path.node.key)) {
          const orig = path.node.key.value;
          const mapped = propMap[orig];
          if (mapped) path.get('key').replaceWith(t.stringLiteral(mapped));
        }
      }
    },

    ClassMethod(path) {
      if (!MANGLE_PROPS) return;
      if (!path.node.computed && t.isIdentifier(path.node.key)) {
        const orig = path.node.key.name;
        const mapped = propMap[orig];
        if (mapped) path.get('key').replaceWith(t.identifier(mapped));
      }
    },

    ClassProperty(path) {
      if (!MANGLE_PROPS) return;
      if (!path.node.computed && t.isIdentifier(path.node.key)) {
        const orig = path.node.key.name;
        const mapped = propMap[orig];
        if (mapped) path.get('key').replaceWith(t.identifier(mapped));
      }
    }
  });


  const out = generator(ast, {
    compact: false,
    retainLines: false,
    comments: false
  }, src);

  return out;
};

module.exports = { astCode };