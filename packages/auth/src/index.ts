import { tanstackStartCookies } from 'better-auth/tanstack-start';
import { db } from "@base-template/db";
import * as schema from "@base-template/db/schema/auth";
import { env, isPolarEnabled } from "@base-template/env/server";
import { polar, checkout, portal } from "@polar-sh/better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import type { BetterAuthPlugin } from "better-auth";

import { polarClient } from "./lib/payments";

const plugins: BetterAuthPlugin[] = [tanstackStartCookies()];

if (isPolarEnabled && polarClient) {
  plugins.unshift(
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      enableCustomerPortal: true,
      use: [
        checkout({
          products: [
            {
              productId: "your-product-id",
              slug: "pro",
            },
          ],
          successUrl: env.POLAR_SUCCESS_URL!,
          authenticatedUsersOnly: true,
        }),
        portal(),
      ],
    })
  );
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",

    schema: schema,
  }),
  trustedOrigins: [env.CORS_ORIGIN],
  emailAndPassword: {
    enabled: true,
  },
  plugins,
});
