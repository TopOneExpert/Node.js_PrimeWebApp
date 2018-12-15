const dev = {
  MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    REGION: "us-east-1",
    BUCKET: "projectprimeapi-dev-attachmentsbucket-11maytdalqt0x",
  },
  apiGateway: {
    REGION: 'us-east-1',
    URL: 'https://wqh99ygine.execute-api.us-east-1.amazonaws.com/dev',
  },
  cognito: {
    REGION: 'us-east-1',
    USER_POOL_ID: 'us-east-1_99G66SRMD',
    APP_CLIENT_ID: 'qep4as494nao0v7mutv5nu8hc',
    IDENTITY_POOL_ID: 'us-east-1:5abf0f7c-49ec-44ba-b146-097f415244b7',
  },
  social: {
    FB: '351675005649955',
  },
};

const prod = {};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === 'prod' ? prod : dev;

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config,
};
