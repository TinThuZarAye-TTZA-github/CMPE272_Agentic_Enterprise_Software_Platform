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

## API for CURD

### POST 
https://vhr61ozfi9.execute-api.us-east-2.amazonaws.com/dev/student

<img width="750" height="635" alt="Screenshot 2025-09-21 at 6 19 00 PM" src="https://github.com/user-attachments/assets/9ae0e9c2-248d-4437-bbf2-8324c7a9f42c" />


### GET
https://vhr61ozfi9.execute-api.us-east-2.amazonaws.com/dev/student?student_id=1

<img width="750" height="635" alt="Screenshot 2025-09-21 at 6 21 50 PM" src="https://github.com/user-attachments/assets/17f49586-267f-47d1-aa3e-8aaeb1a33e27" /> 

### GET ALL
https://vhr61ozfi9.execute-api.us-east-2.amazonaws.com/dev/student

<img width="750" height="635" alt="Screenshot 2025-09-21 at 6 23 53 PM" src="https://github.com/user-attachments/assets/b2596cb8-81f9-40de-b232-c50b5ffb46c3" />

### Update
https://vhr61ozfi9.execute-api.us-east-2.amazonaws.com/dev/student?student_id=1

<img width="750" height="635" alt="Screenshot 2025-09-21 at 6 24 27 PM" src="https://github.com/user-attachments/assets/f89b7165-d4ee-4ea8-b1f9-ed1e6aeeb6f5" />

### Delete
https://vhr61ozfi9.execute-api.us-east-2.amazonaws.com/dev/student?student_id=1

<img width="750" height="635" alt="Screenshot 2025-09-21 at 6 26 38 PM" src="https://github.com/user-attachments/assets/4fcd5571-6122-4aa1-a6ef-8fd605ba4dfc" />

