// Base URL prefix for backend API calls.
// Relative path — resolves against the page origin (works in prod and local Docker).
// nginx routes /complex/* to pms-server, stripping the /complex prefix.
export const apiBase = '/complex'
