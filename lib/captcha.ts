export async function verifyCaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error('RECAPTCHA_SECRET_KEY not configured');
    return false;
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();

    // For reCAPTCHA v3, check score (0.0 - 1.0)
    // Score of 0.5+ is generally considered legitimate
    return data.success && data.score >= 0.5;
  } catch (error) {
    console.error('CAPTCHA verification error:', error);
    return false;
  }
}
