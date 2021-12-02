import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { Dynamo } from '@libs/dynamodb';

import schema from './schema';

const saveData: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { queryStringParameters } = event;
  const { realmId, code, state } = queryStringParameters;

  const params = {
    TableName: 'ShahidTable',
    Item: {
      realmId,
      code,
      state,
      authToken: '',
      refreshToken: '',
    },
  };

  await Dynamo.createData(params);
  return formatJSONResponse({
    message: event
  });
}

export const main = middyfy(saveData);
