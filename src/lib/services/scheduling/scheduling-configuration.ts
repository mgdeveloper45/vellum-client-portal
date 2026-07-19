export interface BusinessDayConfiguration {
  enabled: boolean;
  open: string;
  close: string;
}

export interface BusinessHoursConfiguration {
  sunday: BusinessDayConfiguration;
  monday: BusinessDayConfiguration;
  tuesday: BusinessDayConfiguration;
  wednesday: BusinessDayConfiguration;
  thursday: BusinessDayConfiguration;
  friday: BusinessDayConfiguration;
  saturday: BusinessDayConfiguration;
}

export interface SchedulingConfiguration {
  minimumAdvanceNoticeMinutes: number;
  maximumBookingWindowDays: number;

  preBookingBufferMinutes: number;
  postBookingBufferMinutes: number;

  businessHours: BusinessHoursConfiguration;
}

export const defaultSchedulingConfiguration: SchedulingConfiguration = {
  minimumAdvanceNoticeMinutes: 0,

  maximumBookingWindowDays: 90,

  preBookingBufferMinutes: 0,
  postBookingBufferMinutes: 0,

  businessHours: {
    sunday: {
      enabled: false,
      open: "09:00",
      close: "17:00",
    },
    monday: {
      enabled: true,
      open: "09:00",
      close: "17:00",
    },
    tuesday: {
      enabled: true,
      open: "09:00",
      close: "17:00",
    },
    wednesday: {
      enabled: true,
      open: "09:00",
      close: "17:00",
    },
    thursday: {
      enabled: true,
      open: "09:00",
      close: "17:00",
    },
    friday: {
      enabled: true,
      open: "09:00",
      close: "17:00",
    },
    saturday: {
      enabled: true,
      open: "09:00",
      close: "17:00",
    },
  },
};
