import { executeWorkflow } from "./workflow-engine";

export async function testWorkflow() {
  await executeWorkflow({
    event: "DEPOSIT_PAID",

    payload: {
      depositId: "demo",

      amount: 500,
    },
  });
}
