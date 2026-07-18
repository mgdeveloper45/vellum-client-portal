import { AdvanceNoticePolicy } from "./policies/advance-notice-policy";
import { PolicyPipeline } from "./policies/policy-pipeline";
import { processScheduling } from "./scheduling-orchestrator";
import { BookingWindowPolicy } from "./policies/booking-window-policy";

const policyPipeline = new PolicyPipeline([
  new AdvanceNoticePolicy(),
  new BookingWindowPolicy(),
]);

export const schedulingEngine = {
  process(request: Parameters<typeof processScheduling>[0]) {
    return processScheduling(request, {
      policyPipeline,
    });
  },
};
