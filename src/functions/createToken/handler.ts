import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { Dynamo, oauthClient } from '@libs/dynamodb';

import schema from './schema';

const createToken: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {

  const params = {
    TableName: "ShahidTable"
  };
  const data = await Dynamo.getData(params);

  const realmId = data.Items[0].realmId;
  const code = data.Items[0].code;
  const state = data.Items[0].state;
  
  const url = `/saveData?code=${code}&state=${state}&realmId=${realmId}`;

  const authTokenInfo = await oauthClient.createToken(url);
  
  const token = authTokenInfo.getJson();
  const refreshToken = token.refresh_token;
  const authToken = token.access_token;

  const params1 = {
    TableName: "ShahidTable",
    Key: {
      realmId
    },
    UpdateExpression: "set refreshToken = :rToken, authToken = :aToken",
    ExpressionAttributeValues: {
      ":rToken": refreshToken,
      ":aToken": authToken
    },
  };
  
  await Dynamo.updateData(params1);

  return formatJSONResponse({
    message: authToken
  });

}

export const main = middyfy(createToken);
