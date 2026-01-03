import { env, isPolarEnabled } from "@base-template/env/server";
import { Polar } from "@polar-sh/sdk";

export const polarClient = isPolarEnabled
  ? new Polar({
      accessToken: env.POLAR_ACCESS_TOKEN!,
      server: "sandbox",
    })
  : null;
