import pRetry from "p-retry";

const headers = new Headers();
headers.set("Content-Type", "application/json");

export async function sendVerificationEmail({ email, name }) {
  const response = await pRetry(
    () =>
      fetch("/api/mail/addressVerification", {
        body: JSON.stringify({
          name,
          email,
        }),
        method: "POST",
        headers,
      }),
    {
      retries: 3,
    }
  );
  if (!response.ok) {
    throw new Error(response.statusText);
  }
}

export async function verifyEmailVerificationCode({ email, verificationCode }) {
  const response = await pRetry(
    () =>
      fetch("/api/token", {
        body: JSON.stringify({
          subjectId: email,
          token: verificationCode,
          purpose: "EmailVerification",
        }),
        method: "PUT",
        headers,
      }),
    {
      retries: 3,
    }
  );

  if (!response.ok) {
    throw new Error(response.statusText);
  }
}
