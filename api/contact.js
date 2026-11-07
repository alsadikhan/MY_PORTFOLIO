const recipient = 'alsadikhan0@gmail.com';
const allowedTopics = new Set(['Internship', 'Project', 'Collaboration', 'Just saying hi']);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is missing from the deployment environment.');
    return res.status(503).json({
      error: 'Resend API key is missing. Add RESEND_API_KEY to Vercel Environment Variables, then redeploy.',
    });
  }

  let data = req.body;
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch {
      return res.status(400).json({ error: 'Invalid form submission.' });
    }
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return res.status(400).json({ error: 'Invalid form submission.' });
  }

  const { name, email, topic, message } = data;
  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof topic !== 'string' ||
    typeof message !== 'string' ||
    name.trim().length < 1 ||
    name.trim().length > 100 ||
    email.trim().length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    !allowedTopics.has(topic) ||
    message.trim().length < 1 ||
    message.trim().length > 5000
  ) {
    return res.status(400).json({ error: 'Please check your form details and try again.' });
  }

  const safeName = name.trim();
  const safeEmail = email.trim();
  const safeMessage = message.trim();

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev',
        to: [recipient],
        reply_to: safeEmail,
        subject: `[${topic}] Message from ${safeName}`,
        text: `Name: ${safeName}\nEmail: ${safeEmail}\nTopic: ${topic}\n\n${safeMessage}`,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      let resendError;
      try {
        resendError = await response.json();
      } catch {
        resendError = null;
      }
      const errorCode = resendError && resendError.name;
      console.error(`Resend request failed with status ${response.status}${errorCode ? ` (${errorCode})` : ''}.`);
      if (response.status === 401) {
        return res.status(502).json({
          error: 'Resend rejected the API key. Add a valid RESEND_API_KEY in Vercel and redeploy.',
        });
      }
      if (response.status === 403 || response.status === 422) {
        return res.status(502).json({
          error: 'Resend rejected the sender or recipient. Verify a sender domain in Resend and set CONTACT_FROM_EMAIL in Vercel. With the test sender, the recipient must be the email address on your Resend account.',
        });
      }
      return res.status(502).json({ error: 'Message could not be sent. Please try again later.' });
    }

    return res.status(200).json({ message: 'Your message has been sent.' });
  } catch (error) {
    console.error('Contact email request failed.', error.name || 'Unknown error');
    return res.status(502).json({ error: 'Message could not be sent. Please try again later.' });
  }
};
