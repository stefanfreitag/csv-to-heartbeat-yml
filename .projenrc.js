const { awscdk } = require('projen');
const { Stability } = require('projen/lib/cdk');

const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.55.1',
  name: 'cdk',
  authorEmail: 'stefan.freitag@ud.edu',
  authorName: 'Stefan Freitag',
  license: 'Apache-2.0',
  description: 'Converts CSV data to heartbeat yml files.',
  defaultReleaseBranch: 'master',
});

project.npmignore.exclude('data.csv', 'assets/vendor/*', '.history');
project.gitignore.exclude('data.csv', 'assets/vendor/*', '.history');
project.synth();