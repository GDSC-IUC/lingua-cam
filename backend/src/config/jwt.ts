export const jwtConfig = {
  accessSecret: process.env.JWT_ACCESS_SECRET || 'fallback_access_secret',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
  accessExpires: process.env.JWT_ACCESS_EXPIRES || '15m',
  refreshExpires: process.env.JWT_REFRESH_EXPIRES || '7d',
};
