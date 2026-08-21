export const demoWorkspace = {
  name: "Vellum Demo",
  companyName: "Northstar Creative",
  healthScore: 92,
};

export const demoClients = [
  {
    id: "client-sarah",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah@northstar-demo.com",
    company: "Atlas Coffee Co.",
    status: "ACTIVE",
  },
  {
    id: "client-daniel",
    firstName: "Daniel",
    lastName: "Kim",
    email: "daniel@northstar-demo.com",
    company: "Lumen Interiors",
    status: "ACTIVE",
  },
  {
    id: "client-maya",
    firstName: "Maya",
    lastName: "Patel",
    email: "maya@northstar-demo.com",
    company: "Fieldwork Studio",
    status: "ACTIVE",
  },
];

export const demoProjects = [
  {
    id: "project-atlas",
    name: "Atlas Coffee Website Redesign",
    clientId: "client-sarah",
    clientName: "Sarah Johnson",
    status: "ACTIVE",
    progress: 72,
    nextMilestone: "Client Approval",
    outstandingRevenue: 2500,
  },
  {
    id: "project-lumen",
    name: "Lumen Brand Identity",
    clientId: "client-daniel",
    clientName: "Daniel Kim",
    status: "ACTIVE",
    progress: 45,
    nextMilestone: "Brand Presentation",
    outstandingRevenue: 0,
  },
];

export const demoBookings = [
  {
    id: "booking-consultation",
    clientId: "client-maya",
    customerName: "Maya Patel",
    serviceName: "Creative Strategy Consultation",
    dateLabel: "Today",
    timeLabel: "10:00 AM – 11:00 AM",
    status: "CONFIRMED",
    healthScore: 85,
    projectId: null,
    depositRequired: true,
    depositPaid: false,
  },
  {
    id: "booking-review",
    clientId: "client-sarah",
    customerName: "Sarah Johnson",
    serviceName: "Website Review",
    dateLabel: "Tomorrow",
    timeLabel: "2:00 PM – 3:00 PM",
    status: "CONFIRMED",
    healthScore: 100,
    projectId: "project-atlas",
    depositRequired: false,
    depositPaid: false,
  },
];

export const demoInvoices = [
  {
    id: "INV-1042",
    projectId: "project-atlas",
    projectName: "Atlas Coffee Website Redesign",
    clientName: "Sarah Johnson",
    amount: 2500,
    status: "OVERDUE",
    dueLabel: "Due 5 days ago",
  },
  {
    id: "INV-1041",
    projectId: "project-lumen",
    projectName: "Lumen Brand Identity",
    clientName: "Daniel Kim",
    amount: 1800,
    status: "PAID",
    dueLabel: "Paid",
  },
];

export const demoProposals = [
  {
    id: "proposal-fieldwork",
    clientName: "Maya Patel",
    projectName: "Fieldwork Digital Strategy",
    amount: 4200,
    status: "PENDING",
  },
];

export const demoMessages = [
  {
    id: "message-1",
    clientName: "Sarah Johnson",
    projectName: "Atlas Coffee Website Redesign",
    preview:
      "The latest homepage direction looks great. Can we review mobile next?",
    timeLabel: "18 min ago",
  },
  {
    id: "message-2",
    clientName: "Daniel Kim",
    projectName: "Lumen Brand Identity",
    preview: "I uploaded the remaining brand references.",
    timeLabel: "2 hr ago",
  },
];

export const demoServices = [
  {
    id: "service-strategy",
    name: "Creative Strategy Consultation",
    duration: "60 minutes",
    price: 250,
    active: true,
  },
  {
    id: "service-review",
    name: "Website Review",
    duration: "60 minutes",
    price: 175,
    active: true,
  },
  {
    id: "service-brand",
    name: "Brand Discovery Session",
    duration: "90 minutes",
    price: 350,
    active: true,
  },
];

export const demoNotifications = [
  {
    id: "notification-invoice",
    title: "Invoice requires follow-up",
    description: "INV-1042 is overdue and has $2,500 outstanding.",
    read: false,
  },
  {
    id: "notification-booking",
    title: "Upcoming booking",
    description: "Creative Strategy Consultation begins today at 10:00 AM.",
    read: false,
  },
  {
    id: "notification-file",
    title: "New project files",
    description: "Daniel Kim uploaded files to Lumen Brand Identity.",
    read: true,
  },
];

export const demoAuditEvents = [
  {
    id: "audit-1",
    action: "Invoice created",
    subject: "INV-1042",
    actor: "Marcus",
    timeLabel: "5 days ago",
  },
  {
    id: "audit-2",
    action: "Project updated",
    subject: "Atlas Coffee Website Redesign",
    actor: "Marcus",
    timeLabel: "Yesterday",
  },
  {
    id: "audit-3",
    action: "Files uploaded",
    subject: "Lumen Brand Identity",
    actor: "Daniel Kim",
    timeLabel: "2 hours ago",
  },
];
