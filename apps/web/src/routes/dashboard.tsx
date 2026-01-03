import { createFileRoute, redirect } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { getPayment } from "@/functions/get-payment";
import { getUser } from "@/functions/get-user";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await getUser();
    const paymentState = await getPayment();
    return { session, paymentState };
  },
  loader: async ({ context }) => {
    if (!context.session) {
      throw redirect({
        to: "/login",
      });
    }
  },
});

function RouteComponent() {
  const { session, paymentState } = Route.useRouteContext();

  const hasProSubscription = paymentState.enabled
    ? (paymentState.customerState?.activeSubscriptions?.length ?? 0) > 0
    : false;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {session?.user.name}</p>
      {paymentState.enabled ? (
        <>
          <p>Plan: {hasProSubscription ? "Pro" : "Free"}</p>
          {hasProSubscription ? (
            <Button
              onClick={async function handlePortal() {
                await authClient.customer.portal();
              }}
            >
              Manage Subscription
            </Button>
          ) : (
            <Button
              onClick={async function handleUpgrade() {
                await authClient.checkout({ slug: "pro" });
              }}
            >
              Upgrade to Pro
            </Button>
          )}
        </>
      ) : null}
    </div>
  );
}
