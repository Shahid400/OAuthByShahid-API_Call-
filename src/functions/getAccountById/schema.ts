export default {
  type: "object",
  properties: {
    realmId: {type: 'string'},
    accountId: {type: 'string'},
    token: {type: 'string'}
  },
  required: []
} as const;
