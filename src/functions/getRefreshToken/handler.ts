import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { Dynamo, oauthClient } from '@libs/dynamodb';

import schema from './schema';

const getRefreshToken: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {

    const params = {
        TableName: "ShahidTable"
      };
      const data = await Dynamo.getData(params);
      const realmId = data.Items[0].realmId;
      const refreshToken = data.Items[0].refreshToken;

    const authTokenInfo = await oauthClient.refreshUsingToken(refreshToken);

    const authToken = authTokenInfo.token.access_token;

    const params1 = {
        TableName: "ShahidTable",
        Key: {
          realmId
        },
        UpdateExpression: "set authToken = :aToken",
        ExpressionAttributeValues: {
          ":aToken": authToken
        },
      };
      
      await Dynamo.updateData(params1);
    

    return formatJSONResponse({
        message: authToken
    });

}

export const main = middyfy(getRefreshToken);
