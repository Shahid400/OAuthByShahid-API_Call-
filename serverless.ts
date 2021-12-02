import type { AWS } from '@serverless/typescript';

import { 
  authorizeUri, saveData, createToken, getRefreshToken, 
  createAccount,  queryAccount, updateAccount 
} from './src/functions';
import getAccountById from '@functions/getAccountById';

const serverlessConfiguration: AWS = {
  service: 'oauthbyshahid',
  frameworkVersion: '2',
  custom: {
    dynamodb: {
      stages: ["dev"],
      start: {
        port: 8000,
        migrate: true,
        seed: true
      },
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  plugins: [
    'serverless-esbuild',
    'serverless-dynamodb-local',
    'serverless-offline'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'ap-southeast-1',
    iamRoleStatements:
    [
      {
        Effect: 'Allow',
        Action: ['dynamodb:*'],
        Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.DB_TABLE}'
      }
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      DB_TABLE:'ShahidTable',
    },
    lambdaHashingVersion: '20201221',
  },
  resources: {
    Resources:{
      ShahidTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
           TableName: "ShahidTable",
           BillingMode: "PAY_PER_REQUEST",
           AttributeDefinitions: [
             { AttributeName: 'realmId', AttributeType: 'S' }
           ],
           KeySchema: [
            { AttributeName: 'realmId', KeyType: 'HASH'}
           ],
        },
      }
    }
  },
  // import the function via paths
  functions: { authorizeUri, saveData, createToken, getRefreshToken, getAccountById, createAccount, queryAccount, updateAccount },
  
};

module.exports = serverlessConfiguration;
