import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient, 
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand
}from  "@aws-sdk/lib-dynamodb";

// This is the changes please uploaded to the aws
const client = new DynamoDBClient({});

//auto convert plain JS objects from/to DynamoDB's wire format
// eg. can write {student_id : "123", name "John"} --> instance of --> {student_id : {S: "123"}, name : {S: "John"}}
const DB = DynamoDBDocumentClient.from(client, {marshallOptions : {removeUndefinedValues : true}});

const TABLE = process.env.TABLE_NAME ?? "StudentRecord"

const success = (body , statusCode = 200) => ({
  statusCode,
  headers : {"Content-Type" : "application/json"},
  body : JSON.stringify(body)
});

const failure = (body, statusCode = 500) => ({
  statusCode,
  headers : { "Content-Type" : "application/json"},
  body : JSON.stringify({error: err?.message || String(err)})
})



function extractStudentID(event, bodyObj) {
  return (
    event?.pathParameters?.student_id || 
    event?.queryStringParameters?.student_id || bodyObj?.student_id || null
  )
}

function UpdateHelper(item, keyField = "student_id") {
  const updates = {...item} 
  
  // name = "AA" , update.name = "BB" ---> name = "BB"
  //remove the primary key field , so it don't try to update the PK in DynamoDB
  delete updates[keyField]

  // if the value is undefined delete the key
  //eg: const upateds = {name : "AA", grade : "undefined", course : "Math"}
  // after update ==> {name : "AA", course : "Math"}
  Object.keys(updates).forEach(k => updates[k] === undefined && delete updates[k])

  const keys = Object.keys(updates);
  if(!keys.length) return null;

  let UpdateExpression = "SET"
  const ExpressionAttributeNames = {}
  const ExpressionAttributeValues = {}


  keys.forEach((key, i) => {
    const name_key = `#k${i}`
    const value_key = `:v${i}`
    if(i) UpdateExpression += ", "

    UpdateExpression += `${name_key} = ${value_key}`
    ExpressionAttributeNames[name_key] = key;
    ExpressionAttributeValues[value_key] = updates[key]

  });
  

  return {UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues}
}

export const handler = async (event) => {

  const action = (event?.requestContext?.http?.method || event?.httpMethod || "").toUpperCase();
  
  // request body into a plain JS object
  let bodyObj = {};
  if(typeof event.body === "string") {
    try {
      bodyObj = JSON.parse(event.body || "{}");
    }catch (err){
      bodyObj = {};
      return failure(err, 400);
    } 
  }else if(event?.body) {
    bodyObj = event.body;
  }

  const student_id = extractStudentID(event, bodyObj);

  try {
    // POST
    if (action === "POST") {
      if(!student_id) return failure("Missing student_id", 400);  
      const item = {student_id, ...bodyObj }
      await DB.send(new PutCommand({
      TableName : TABLE, Item : item,
      // if this line exit, the catch block need to return proper response
      // prevent the duplicate primary_key
      ConditionExpression: "attribute_not_exists(student_id)"
    }));
    return success({message : "The new student record is created", student_id}, 201)

    } 

    // GET ALL ITEM
    else if(action === "GET" && !student_id) {
      let allItems = []
      let ExclusiveStartKey;
      do {
        const params = {
          TableName : TABLE,
          ExclusiveStartKey : ExclusiveStartKey
        };
        const {Items, LastEvaluatedKey } = await DB.send(new ScanCommand(params))
        if(Items) {
          allItems = allItems.concat(Items)

        }
        ExclusiveStartKey = LastEvaluatedKey
      }while(ExclusiveStartKey)
      return success(allItems)
    }


    // GET item 
    else if(action === "GET") {
      if(!student_id) return failure("Missing student_id", 400);  
      const {Item} = await DB.send(new GetCommand({
        TableName : TABLE, Key : {student_id},
      }));
      if(!Item) {
        return success({message : `student_id = ${student_id} not exit`})
      }
      return success(Item)
    } 
    


    

    // UPDATE
    else if (action === "PUT") {
      const updated = UpdateHelper(bodyObj, ["student_id"])
      const out = await DB.send(new UpdateCommand({
        TableName : TABLE,
        Key : {student_id},
        ...updated,
        ConditionExpression : "attribute_exists(student_id)",
        ReturnValues : "ALL_NEW"
      }))

      return success({message : "successfully updated", item: out.Attributes })
    }
    
    // DELETE
    else if(action === "DELETE") {
      if(!student_id) return failure("Student not exit", 400)
      await DB.send(new DeleteCommand({
        TableName : TABLE, 
        Key : {student_id},
        ConditionExpression: "attribute_exists(student_id)"
      }));

     
    return success({ message: `Deleted student_id = ${student_id} successfully` }, 200);
    }

    return failure("Unknown action", 400);
  
  }catch(err) {

    // ConditionExpression: "attribute_not_exists(student_id)"
    // This ConditionExpression is only for (PUT/DELECT/UPDATE)
    if(err?.name === "ConditionalCheckFailedException") {
      if(action === "POST") {
        return success({message : `student_id = ${student_id} already exist `})

      } 
      else if(action === "PUT") {
        return success({message : `student_id = ${student_id} not exist` })
      }
      else if(action === "DELETE") {
        return success({message : `student_id = ${student_id} not exist`})
      }
    }
    console.error(err)
  }
  return failure("Unknown action", 400);
}



