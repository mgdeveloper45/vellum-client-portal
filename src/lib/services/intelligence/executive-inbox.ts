import { sortByPriority, type Priority } from "./priority";

export type ExecutiveInboxItem = {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  href: string;
  source: "WORKSPACE" | "BOOKING" | "FINANCE" | "CLIENT" | "GROWTH";
};

export function buildExecutiveInbox(items: ExecutiveInboxItem[]) {
  return sortByPriority(items);
}
