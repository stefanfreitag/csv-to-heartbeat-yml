import { LambdaRestApi } from '@aws-cdk/aws-apigateway';
import { Code, Function, LayerVersion, Runtime } from '@aws-cdk/aws-lambda';
import { RetentionDays } from '@aws-cdk/aws-logs';
import { App, CfnOutput, Construct, Duration, Stack, StackProps } from '@aws-cdk/core';
export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const layer = this.createLayer();
    const f: Function = this.createFunction(layer);


    const gw = new LambdaRestApi(this, 'api-gw', {
      handler: f,
      description:
        'Converts CSV data to Heartbeat yml files',
      proxy: false,
      binaryMediaTypes: ['application/zip', 'application/octet-stream'],

    });
    const converter = gw.root.addResource('converter');
    converter.addMethod('POST');

    new CfnOutput(this, 'apiGw', {
      description: 'URL of the API gateway',
      value: gw.url,
    });
  }
  private createLayer(): LayerVersion {
    return new LayerVersion(this, 'csv-heartbeat-converter-layer', {
      compatibleRuntimes: [Runtime.RUBY_2_7],
      description: 'Provides ruby libraries for the csv converter',
      code: Code.fromAsset('../vendor/bundle/'),
    });
  }
  private createFunction(layer: LayerVersion) {
    return new Function(this, 'fnUpload', {
      runtime: Runtime.RUBY_2_7,
      description: 'Converts CSV data and returns a zipped archive',
      handler: 'main.handler',
      code: Code.fromAsset('../src'),
      timeout: Duration.minutes(1),
      memorySize: 256,
      layers: [layer],
      logRetention: RetentionDays.ONE_WEEK,
    });
  }

}

const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new MyStack(app, 'csv-to-heartbeat-yml-converter', { env: devEnv });

app.synth();