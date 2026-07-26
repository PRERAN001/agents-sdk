export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    const formData = new FormData();
    formData.append(
      "secret",
      process.env.TURNSTILE_SECRET_KEY!
    );
    formData.append("response", token);

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    return Response.json(data);
  } catch (err) {
    console.error(err);

    return Response.json(
      {
        success: false,
        error: "Verification failed",
      },
      {
        status: 500,
      }
    );
  }
}