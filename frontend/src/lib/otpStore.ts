// Shared in-memory OTP store across API routes
// Keyed by "admin_otp" — single admin user
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

export default otpStore;
