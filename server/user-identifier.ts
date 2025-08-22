import { Request } from "express";
import { createHash } from "crypto";

/**
 * Generates a unique user identifier based on system information
 * Uses IP address, user agent, and other request headers to create a consistent identifier
 */
export function generateUserIdentifier(req: Request): string {
  // Get the real IP address, considering proxies and load balancers
  const ip = req.ip || 
             req.connection?.remoteAddress || 
             req.socket?.remoteAddress || 
             req.headers['x-forwarded-for']?.toString()?.split(',')[0]?.trim() ||
             req.headers['x-real-ip']?.toString() ||
             'unknown';

  // Get user agent
  const userAgent = req.headers['user-agent'] || 'unknown';
  
  // Get accept-language as additional identifier
  const acceptLanguage = req.headers['accept-language'] || 'unknown';
  
  // Create a hash from these identifiers
  const identifier = `${ip}-${userAgent}-${acceptLanguage}`;
  const hash = createHash('sha256').update(identifier).digest('hex');
  
  // Return first 16 characters for readability
  return hash.substring(0, 16);
}

/**
 * Middleware to add user identifier to request
 */
export function addUserIdentifier(req: any, res: any, next: any) {
  req.userId = generateUserIdentifier(req);
  next();
}