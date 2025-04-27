import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";


/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
});

const bedrockDataSource = backend.data.resources.graphqlApi.addHttpDataSource(
  "bedrockDS",
  "https://bedrock-runtime.us-east-1.amazonaws.com",
  {
    authorizationConfig: {
      signingRegion: "us-east-1",
      signingServiceName: "bedrock",
    },
  }
);

// Grant explicit permissions to invoke Bedrock models
bedrockDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      "bedrock:InvokeModel",
      "bedrock:InvokeModelWithResponseStream"
    ],
    resources: [
      // Use a valid model ID that you have access to
      "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0",
      // Add other models as needed
      "arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-text-express-v1"
    ],
  })
);
