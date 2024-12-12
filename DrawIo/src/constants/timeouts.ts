export const TIMEOUTS = {
  INACTIVITY: 300000, // 5 minutes
  LEAVE_CONFIRMATION: 5000, // 5 seconds
  RECONNECT_ATTEMPT: 3000, // 3 seconds
  INACTIVITY_WARNING: 270000, // 4.5 minutes (warning before inactivity timeout)
} as const;
