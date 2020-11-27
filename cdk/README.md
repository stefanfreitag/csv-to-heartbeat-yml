# CDK App

This CDK application deploys the Ruby application as a Lambda function and makes it
available via an API Gateway.

## Preparing the Lambda layer

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

- Installing all dependencies required to build the CDK application.

  ```sh
  cd cdk
  npm install
  npm run build
  ```

- Deploying the stack

  ```sh
  cdk deploy --profile <AWS Profile>
  ```

- Undeploying the stack
  
  ```sh
  cdk destroy --profile <AWS Profile>
  ```
