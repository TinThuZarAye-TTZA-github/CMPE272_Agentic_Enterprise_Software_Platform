# Building a SeverLess WebApplication with AWS Lambda and DynamoDB

## Setting up the DynamoDB Table
- Go to the AWS Management Console
- Navigate to DymanoDB
- Create a new table:
    - Table name
    - Primary Key

## Creating the AWS Lambda function
- Go to the AWS Management Console
- Navigate to Lambda
- Create a new lambda function
      - function name
      - Runtime - choose Python3.x or Node.js
      - Permission : AmazonDynamoDBFullAccess
- Implement the CURD operations with DynamoDB

## Creating the API Gateway 
- Go to the AWS Management Concole
- Navigate to API Gateway
- Create a new REST API
      - API name
- Create Resource
      - eg. /student
- Create method PUT/GET/DELETE/UPDATE
- Deploye API --> stage --> dev
      - dev/student
