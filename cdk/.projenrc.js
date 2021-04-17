const { AwsCdkTypeScriptApp } = require('projen');

const project = new AwsCdkTypeScriptApp({
  cdkVersion: '1.98.0',
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
});

project.synth();