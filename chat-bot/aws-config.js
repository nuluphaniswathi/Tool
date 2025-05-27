import AWS from 'aws-sdk';

AWS.config.update({
    region: 'us-east-1', // Replace with your AWS Region
    credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:e2250950-d181-43a2-8820-e352675d4faf', // Replace with your Identity Pool ID
    }),
});
const lexRuntime = new AWS.LexRuntimeV2();

export default lexRuntime;