module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transformIgnorePatterns: [
    '/node_modules/(?!(next-mdx-remote|@mdx-js|unist-|unified|bail|is-plain-obj|trough|vfile|remark-|micromark-|micromark|estree-util-|estree-walker|parse-entities|character-entities|mdast-util-|character-reference-invalid|is-|stringify-entities|periscopic|hast-util-|comma-separated-tokens|property-information|space-separated-tokens|zwitch|ccount|decode-named-character-reference))'
  ],
  transform: {
    '\\.m?[jt]sx?$': [
      'esbuild-jest',
      {
        sourcemap: true,
        loaders: {
          '.mjs': 'jsx'
        }
      }
    ]
  },
  moduleNameMapper: {
    'estree-walker': '<rootDir>/node_modules/estree-walker/src/index.js'
  }
};
