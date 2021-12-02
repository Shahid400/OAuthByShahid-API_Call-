import { middyfy } from '@libs/lambda';
import { Handler } from 'aws-lambda';
import { formatJSONResponse } from '@libs/apiGateway';
import { oauthClient } from '@libs/dynamodb';

const createAccount: Handler = async (event) => {
  const realmId = event.body.realmId;
  const token = event.body.token;
  const name = event.body.name;
  const accountType = event.body.accountType;

  const body = {
    Name: `${name}`,
    AccountType: `${accountType}`
  }

  const response = await oauthClient.makeApiCall({ url: `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/account?minorversion=62`, 
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body
  });
  
  return formatJSONResponse({
    message: response.json
  });
}

export const main = middyfy(createAccount);
