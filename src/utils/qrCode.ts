/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import QRCode from 'qrcode';

/**
 * Returns the public application base URL for generating genuine,
 * real-world scannable QR codes that can be scanned by standard phone cameras.
 */
export function getPublicAppUrl(): string {
  // 1. Configured via client environment variable
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_APP_URL) {
    const envUrl = String(import.meta.env.VITE_APP_URL).trim();
    if (envUrl) {
      return envUrl.replace(/\/+$/, '');
    }
  }

  // 2. In browser, check window.location
  if (typeof window !== 'undefined' && window.location) {
    const origin = window.location.origin;
    // If not local host, use the current HTTPS origin
    if (origin && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
      return origin.replace(/\/+$/, '');
    }
  }

  // 3. Fallback to the official cloud preview deployment URL
  return 'https://ais-pre-2l5nugll5rgum3y4yrhvtd-126430505601.asia-east1.run.app';
}

/**
 * Constructs the canonical public verification URL for a given booking and verification token.
 */
export function getTicketVerificationUrl(bookingId: string, verificationToken?: string): string {
  const baseUrl = getPublicAppUrl();
  const id = encodeURIComponent(bookingId.trim());
  const token = encodeURIComponent((verificationToken || '').trim());
  return `${baseUrl}/#verify?id=${id}&token=${token}`;
}

/**
 * Generates a high-contrast, scannable PNG data URL with proper quiet zone margin.
 */
export async function generateTicketQRCodeDataUrl(
  bookingId: string,
  verificationToken?: string
): Promise<string> {
  const verificationUrl = getTicketVerificationUrl(bookingId, verificationToken);
  try {
    return await QRCode.toDataURL(verificationUrl, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 280,
      color: {
        dark: '#09090b', // High-contrast zinc-950
        light: '#ffffff' // Pure white background for maximum contrast & phone camera readability
      }
    });
  } catch (error) {
    console.error('Failed to generate QR code data URL:', error);
    throw error;
  }
}

/**
 * Generates an SVG string representation of the QR code for scalable rendering.
 */
export async function generateTicketQRCodeSvg(
  bookingId: string,
  verificationToken?: string
): Promise<string> {
  const verificationUrl = getTicketVerificationUrl(bookingId, verificationToken);
  try {
    return await QRCode.toString(verificationUrl, {
      type: 'svg',
      errorCorrectionLevel: 'M',
      margin: 2,
      color: {
        dark: '#09090b',
        light: '#ffffff'
      }
    });
  } catch (error) {
    console.error('Failed to generate QR code SVG:', error);
    throw error;
  }
}
