
export const URL = process.env.NODE_ENV !== 'DEVELOPMENT' ? `${window.location.origin}` : `${window.location.protocol}//${window.location.hostname}:8080`;