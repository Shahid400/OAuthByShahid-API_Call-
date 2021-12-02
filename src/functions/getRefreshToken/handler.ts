import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { oauthClient } from '@libs/dynamodb';

import schema from './schema';

const getRefreshToken: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

    const refreshToken = event.body.refresh_token;
    console.log("=======================================================");
    console.log("============== In getRefreshToken File");
    console.log(refreshToken);

    const response = await oauthClient.refreshUsingToken(refreshToken);
    return formatJSONResponse({
        message: response
    });

}

export const main = middyfy(getRefreshToken);
