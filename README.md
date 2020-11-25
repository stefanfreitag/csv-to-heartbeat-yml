# Convert CVS file to HeartBeat configuration files

## Installation

### Preparing the Lambda layer

The [Lambda](https://aws.amazon.com/lambda/) layer contains these libraries

- [rubyzip](https://github.com/rubyzip/rubyzip)
- csv

```sh
$ cd src
$ mkdir -p ../vendor/bundle
$ bundle config set path ../vendor/bundle
$ bundle install
[...]
Bundled gems are installed into `../vendor/bundle`
```

## Deploy/ Undeploy the application

```sh
$ cd cdk
$ npm install
$ npm run build

# Deploying the stack
$cdk deploy --profile <AWS Profile>

#  Undeploying the stack
$ cdk destroy --profile <AWS Profile>
```

## Uploading the CSV data using curl

The CSV file containing the information can be uploaded e.g. via curl.

```sh
curl -X POST --data-binary @data.csv -H 'Content-Type:text/csv' https://<api-gateway>.eu-central-1.amazonaws.com/prod/converter --output test.zip
```

## Links

- [AWS CDK](https://github.com/aws/aws-cdk)
- [curl](https://curl.se/)
- [API Gateway Payload Encodings Workflow](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-payload-encodings-workflow.html)
- [HeartBeat Reference YML](https://www.elastic.co/guide/en/beats/heartbeat/current/heartbeat-reference-yml.html)

## ToDos

- Investigate on [fastercsv](https://rubygems.org/gems/fastercsv)
