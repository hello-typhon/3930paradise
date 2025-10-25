'use client';

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export function ReCaptchaProvider({ children }: { children: React.ReactNode }) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!siteKey) {
    console.warn('NEXT_PUBLIC_RECAPTCHA_SITE_KEY not configured');
    return <>{children}</>;
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
      {children}
    </GoogleReCaptchaProvider>
  );
}
