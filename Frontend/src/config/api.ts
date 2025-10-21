// API Configuration for different environments
const config = {
  development: {
    API_BASE_URL: 'http://localhost:4000/api'
  },
  production: {
    API_BASE_URL: 'http://143.198.228.249:4000/api'
  }
};

const environment = process.env.NODE_ENV || 'development';
export const API_BASE_URL = config[environment as keyof typeof config].API_BASE_URL;

export default config;