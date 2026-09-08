/**
 * RigForge API Configuration
 * In development, points to localhost:5000.
 * In production (e.g. Render), uses relative /api or custom VITE_API_BASE_URL.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL !== undefined
    ? import.meta.env.VITE_API_BASE_URL
    : import.meta.env.DEV
    ? 'http://localhost:5000'
    : '';
