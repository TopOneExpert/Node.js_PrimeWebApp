const dev = {
  MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    REGION: "us-east-1",
    BUCKET: "projectprimeapi-dev-attachmentsbucket-17k6mk02ta3b6",
  },
  apiGateway: {
    REGION: 'us-east-1',
    URL: 'https://yvldkjz60d.execute-api.us-east-1.amazonaws.com/dev',
  },
  cognito: {
    REGION: 'us-east-1',
    USER_POOL_ID: 'us-east-1_Bp7UkKka5',
    APP_CLIENT_ID: '8f3f1dqgdj8kjbulnf9gd56v0',
    IDENTITY_POOL_ID: 'us-east-1:95cb7e91-5dfe-4a73-ab34-8ac1f769d575',
  },
  social: {
    FB: '349393112528054',
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
