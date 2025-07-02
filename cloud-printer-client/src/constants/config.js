export const APP_NAME = 'Cloud Printer';

export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  TIMEOUT: 30000, // 30 seconds
};

export const SUPPORTED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB 