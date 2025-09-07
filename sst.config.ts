/// <reference path="./.sst/platform/config.d.ts" />

import { ApiStack } from "./stacks/Api";
import { CacheTable } from "./stacks/DB";
//import { Expenses } from "./stacks/Dynamo";
//import { MyBucket } from "./stacks/S3";

export default $config({
  app(input) {
    return {
      name: "aws-api-ai",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          profile: process.env.AWS_PROFILE
        }
      },
      environment: {
      }
    };
  },
  async run() {
    //const expenses = Expenses();
    const OPEN_AI_SECRET = new sst.Secret("OPEN_AI_SECRET");

    const cache = CacheTable();

    ApiStack({ OPEN_AI_SECRET, cache });

    return { cache: cache.name }
    //MyBucket();
  },
});
