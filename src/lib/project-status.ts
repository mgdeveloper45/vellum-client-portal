export function getProjectStatusVariant(
  status: "PLANNING" | "ACTIVE" | "REVIEW" | "COMPLETED",
): "success" | "warning" | "danger" | "info" {
  switch (status) {
    case "COMPLETED":
      return "success";

    case "ACTIVE":
      return "info";

    case "REVIEW":
      return "warning";

    case "PLANNING":
    default:
      return "danger";
  }
}
