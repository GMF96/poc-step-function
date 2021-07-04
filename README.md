# Step Function POC 
## Description
Simple POC to test locally the use of Step Function with two steps:
* Lambda function that makes a call to viacep API passing CEP and returns the complete information about that CEP
* Publish a message with the CEP informations to a SNS topic

## Services used
* Step Function
* Lambda
* SNS
* SQS

## How to execute?
### Requisites
* Docker
* 7Zip or similar
* nodejs
* AWSLocal CLI or AWS CLI

### Steps to execute the application
1) Zip the .js file inside src/handler to a .zip file
2) Execute the follow steps on the command line:

    - Start localstack services:
        > docker-compose up -d

    - Create lambda for the workflow's first step:
        > awslocal lambda create-function --function-name ConsultCEP --runtime nodejs12.x --handler step-one-lambda.handler --role arn:aws:iam::0000000000001:role/DummyRole --zip-file fileb://step-one-lambda.zip

    - Create SNS topic:
        > awslocal sns create-topic --name viacep_topic

    A SQS can be used to validate that a message was sent to SNS
    - Crate SQS queue (`OPTIONAL`): 
        > awslocal sqs create-queue --queue-name=viacep_queue

    - Create a SNS subscribe to the SQS (`OPTIONAL`):
        > awslocal sns subscribe --topic-arn arn:aws:sns:us-east-1:000000000000:viacep_topic --protocol sqs --notification-endpoint http://localhost:4566/000000000000/viacep_queue

    - Create the state machine:
        > awslocal stepfunctions create-state-machine --definition file://state-machine.json --name "ViaCEPWorkflow" --role-arn "arn:aws:iam::000000000000:role/DummyRole"

    - Execute workflow:
    In this example, the workflow's input is in `input.json` file and is basicaly a CEP
        > awslocal stepfunctions start-execution --state-machine arn:aws:states:us-east-1:000000000000:stateMachine:ViaCEPWorkflow --input file://input.json --name test

    - Describe execution:
        > awslocal stepfunctions describe-execution --execution-arn arn:aws:states:us-east-1:000000000000:execution:ViaCEPWorkflow:test

    To check if the message was sent to SNS and then to SQS, use this command (once per message):
        > awslocal sqs receive-message --queue-url http://localhost:4566/000000000000/viacep_queue


