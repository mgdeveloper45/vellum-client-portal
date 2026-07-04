import { calculateWorkspaceHealth } from "./workspace-health";
import { determineWorkspaceMission } from "./workspace-mission";
import { generateWorkspaceExecutiveBrief } from "./workspace-executive-brief";

export type WorkspaceEngineInput = {
  overdueInvoices: number;
  todaysBookings: number;
  bookingsNeedingAttention: number;
  outstandingRevenue: number;
};

export function buildWorkspaceEngine({
  overdueInvoices,
  todaysBookings,
  bookingsNeedingAttention,
  outstandingRevenue,
}: WorkspaceEngineInput) {
  const mission = determineWorkspaceMission({
    overdueInvoices,
    todaysBookings,
    bookingsNeedingAttention,
  });
  const health = calculateWorkspaceHealth({
    overdueInvoices,
    todaysBookings,
    bookingsNeedingAttention,
  });
  const executiveBrief = generateWorkspaceExecutiveBrief({
  todaysBookings,
  overdueInvoices,
  outstandingRevenue,
  workspaceHealth: health.score,
});
  return {
    mission,
    health,
    executiveBrief
  };
}
