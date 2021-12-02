import * as AWS from 'aws-sdk';
import OAuthClient from 'intuit-oauth';

const documentClient = new AWS.DynamoDB.DocumentClient({
    region: "localhost",
    endpoint: "http://localhost:8000",
});

export const oauthClient = new OAuthClient({
    clientId: 'ABE2ZExJTai3sSt1Hcz3AMN45uuUyluK9Qncs0vBdRTCgHw0Vw',
    clientSecret: 'yPed9IrDeTWEaB6rvXLxeDQFnbj9hAxqkoSbBpa7',
    environment: 'sandbox',
    redirectUri: 'http://localhost:3000/dev/saveData',
});

export const Dynamo = {
    async createData(params) {
        await documentClient.put(params).promise();
        const msg = "Data added successfully to DB";
        return msg;
    },
    async getData(params) {
        const data = await documentClient.scan(params).promise();
        return data;
    },

    async updateData(params) {
        await documentClient.update(params).promise();
        const msg = "Data updated successfully to DB";
        return msg;
    }
}