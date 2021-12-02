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
  const url = `/saveData?code=${data.Items[0].code}&state=${data.Items[0].state}&realmId=${data.Items[0].realmId}`;

  const authTokenInfo = await oauthClient.createToken(url);
  const token = authTokenInfo.getJson();

  return formatJSONResponse({
    message: token
  });

}

export const main = middyfy(createToken);
