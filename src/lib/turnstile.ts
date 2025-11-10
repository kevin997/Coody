/**
 * Cloudflare Turnstile verification utility
 * Verifies CAPTCHA tokens on the server side
 */

export interface TurnstileVerifyResponse {
  success: boolean;
  error_codes?: string[];
  challenge_ts?: string;
  hostname?: string;
}

/**
 * Verify Turnstile token with Cloudflare API
 * @param token - The Turnstile token from the client
 * @param ip - Optional IP address of the user
 * @returns Promise with verification result
 */
export async function verifyTurnstileToken(
  token: string,
  ip?: string
): Promise<TurnstileVerifyResponse> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    console.error('TURNSTILE_SECRET_KEY is not configured');
    return {
      success: false,
      error_codes: ['missing-secret-key'],
    };
  }

  if (!token) {
    return {
      success: false,
      error_codes: ['missing-input-response'],
    };
  }

  try {
    const formData = new FormData();
    formData.append('secret', secretKey);
    formData.append('response', token);
    
    if (ip) {
      formData.append('remoteip', ip);
    }

    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: formData,
      }
    );

    const data: TurnstileVerifyResponse = await response.json();

    return data;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return {
      success: false,
      error_codes: ['verification-failed'],
    };
  }
}

/**
 * Get IP address from request headers
 * @param request - Next.js request object
 * @returns IP address or undefined
 */
export function getClientIp(request: Request): string | undefined {
  // Try various headers in order of preference
  const headers = request.headers;
  
  return (
    headers.get('cf-connecting-ip') || // Cloudflare
    headers.get('x-real-ip') || // Nginx
    headers.get('x-forwarded-for')?.split(',')[0].trim() || // Standard proxy
    undefined
  );
}
