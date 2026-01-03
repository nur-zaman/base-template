import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { isPolarEnabled } from "@base-template/env/server";

import { authClient } from "@/lib/auth-client";
import { authMiddleware } from "@/middleware/auth";

export type PaymentState = {
  enabled: boolean;
  customerState?: Awaited<ReturnType<typeof authClient.customer.state>>["data"];
};

export const getPayment = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async (): Promise<PaymentState> => {
    if (!isPolarEnabled) {
      return { enabled: false };
    }

    const { data: customerState } = await authClient.customer.state({
      fetchOptions: {
        headers: getRequestHeaders(),
      },
    });
    return { enabled: true, customerState };
  });
