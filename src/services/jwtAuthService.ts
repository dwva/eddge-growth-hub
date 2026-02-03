// Mock JWT Authentication Service for SuperAdmin
// Simulates JWT token generation, validation, and refresh

export type AccessLevel = 'ROOT' | 'OPS' | 'FINANCE';

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'superadmin';
  accessLevel: AccessLevel;
  iat: number;
  exp: number;
}

const TOKEN_STORAGE_KEY = 'eddge_jwt_token';
const TOKEN_EXPIRY_HOURS = 24; // Token expires in 24 hours

/**
 * Generate a mock JWT token
 * In a real implementation, this would be done on the backend
 */
export function generateToken(
  userId: string,
  email: string,
  accessLevel: AccessLevel = 'ROOT'
): string {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + TOKEN_EXPIRY_HOURS * 60 * 60;

  const payload: JWTPayload = {
    userId,
    email,
    role: 'superadmin',
    accessLevel,
    iat: now,
    exp,
  };

  // Mock JWT: base64 encode the payload (in real JWT, this would be signed)
  const encodedPayload = btoa(JSON.stringify(payload));
  const mockHeader = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  
  // Return mock JWT format: header.payload.signature
  // In real implementation, signature would be HMAC-SHA256
  return `${mockHeader}.${encodedPayload}.mock_signature`;
}

/**
 * Decode and validate a JWT token
 */
export function validateToken(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode payload (second part)
    const payloadJson = atob(parts[1]);
    const payload: JWTPayload = JSON.parse(payloadJson);

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return null; // Token expired
    }

    // Validate role
    if (payload.role !== 'superadmin') {
      return null;
    }

    return payload;
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
}

/**
 * Store token in localStorage
 */
export function storeToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

/**
 * Retrieve token from localStorage
 */
export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

/**
 * Remove token from localStorage
 */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

/**
 * Check if token exists and is valid
 */
export function isTokenValid(): boolean {
  const token = getStoredToken();
  if (!token) {
    return false;
  }

  const payload = validateToken(token);
  return payload !== null;
}

/**
 * Get current user from token
 */
export function getCurrentUser(): JWTPayload | null {
  const token = getStoredToken();
  if (!token) {
    return null;
  }

  return validateToken(token);
}

/**
 * Refresh token (generate new token with same user data)
 */
export function refreshToken(): string | null {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return null;
  }

  const newToken = generateToken(
    currentUser.userId,
    currentUser.email,
    currentUser.accessLevel
  );
  storeToken(newToken);
  return newToken;
}

