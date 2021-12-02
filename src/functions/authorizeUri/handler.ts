import { middyfy } from '@libs/lambda';
import { oauthClient } from '@libs/dynamodb';
import OAuthClient from 'intuit-oauth';
import opn from "opn";

import { Handler } from 'aws-lambda';
import { formatJSONResponse } from '@libs/apiGateway';

const authorizeUri: Handler = async () => {

  const authUri = oauthClient.authorizeUri({
    scope: [OAuthClient.scopes.Accounting],
    state: 'intuit-test',
  });

  const response = {
    statusCode: 301,
    headers: {
      Location: authUri,
    },
  };
  opn(authUri);
  return formatJSONResponse({
    message: response
  });
}

export const main = middyfy(authorizeUri);
