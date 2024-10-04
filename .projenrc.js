const { awscdk } = require('projen');
const { Stability } = require('projen/lib/cdk');
const { UpgradeDependenciesSchedule } = require('projen/lib/javascript');

const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.161.0',
  name: 'csv_to_heartbeat',
  authorEmail: 'stefan.freitag@udo.edu',
  authorName: 'Stefan Freitag',
  stability: Stability.EXPERIMENTAL,
  license: 'Apache-2.0',
  defaultReleaseBranch: 'master',
  depsUpgradeOptions: {
    workflowOptions: {
      schedule: UpgradeDependenciesSchedule.MONTHLY,
    },
  },
  jestOptions: {
    jestVersion: '^29',
  },
  typescriptVersion: '^5',
});

const common_exclude = ['data.csv', 'assets/vendor/*', '.history'];

project.gitignore.exclude(...common_exclude);
project.npmignore.exclude(...common_exclude);

project.synth();
