# CDK App

This CDK application deployed the Ruby application as a Lambda function and makes it 
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
