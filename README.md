# Convert CVS file to HeartBeat configuration files

I was working on the installation and configuration of Elasti.co [Heartbeat](https://www.elastic.co/guide/en/beats/heartbeat/current/heartbeat-overview.html) and found
it quite boring to create the required YAML files for all the services that required monitoring. Hence I decided to automate this tasks:

- As input a CSV file is used. The first row  of this file is treated as header. Its format is

   | Column  |  Meaning |
   | --- | --- |
   | 0 |  Type of check (either `tcp` or `http`) |
   | 1 |  Name of support unit (team owning the monitored service, can be used for alarming)|
   | 2 | Name of application |
   | 3 | Environment (e.g. production, staging, test, development) |
   | 4 | Name of service |
   | 5 | Endpoints to monitor (comma-separated) |
   | 6 | Tags (comma-separated) |
   | 7 | Schedule in seconds|
   | 8 | Check timeout in seconds|

- The output is a zip archive containing all the YAML files for the services.
  After unzipping the archive the YAML files may require an update on ownership (to the user running heartbeat) and permissions (0x644).

## Installation


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
