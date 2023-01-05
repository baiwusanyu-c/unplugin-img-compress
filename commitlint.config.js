module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'update', 'fix', 'refactor', 'optimize', 'style', 'docs', 'chore', 'release'],
    ],
  },
}
