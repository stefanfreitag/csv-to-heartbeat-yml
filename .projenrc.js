const { AwsCdkTypeScriptApp } = require('projen');

const project = new AwsCdkTypeScriptApp({
  cdkVersion: '1.100.0',
  name: 'cdk',
  cdkDependencies: [
    '@aws-cdk/aws-apigateway',
    '@aws-cdk/aws-lambda',
    '@aws-cdk/aws-logs',
  ],
  authorEmail: 'stefan@stefreitag.de',
  authorName: 'Stefan Freitag',
  license: 'Apache-2.0',
  description: 'Converts CSV data to heartbeat yml files.',
  defaultReleaseBranch: 'master',
  scripts: {
    'install-layer-dependencies': 'chmod o+x ./installLayerDependencies.sh;sh ./installLayerDependencies.sh',
  },
});

const npmScripts = project.tryFindObjectFile('package.json');
npmScripts.addOverride('scripts.build', 'npx projen install-layer-dependencies; npx projen build');

project.npmignore.exclude('data.csv', 'assets/vendor/*');
project.gitignore.exclude('data.csv', 'assets/vendor/*');
project.synth();