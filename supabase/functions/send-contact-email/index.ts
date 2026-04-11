import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { name, email, service, message } = body;

    if (!name || !email || !service || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const notifyTo = Deno.env.get("NOTIFY_OWNER_EMAIL");
    const fromEmail = Deno.env.get("NOTIFY_FROM_EMAIL") || "onboarding@resend.dev";

    if (!resendApiKey || !notifyTo) {
      console.error("Missing Resend configuration environment variables.");
      return new Response(
        JSON.stringify({ error: "Server not configured for email notifications." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const ts = new Date().toLocaleString();

    // Send email via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: `Canela Landscaping <${fromEmail}>`,
        to: [notifyTo],
        subject: `New Lead: ${service} inquiry from ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #047857; margin-top: 0;">New Contact Form Submission</h2>
            <p>You have received a new inquiry from your website.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; width: 120px;">Name:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Email:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">
                  <a href="mailto:${email}" style="color: #047857;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Service:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${service}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Time:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${ts}</td>
              </tr>
            </table>

            <h3 style="margin-top: 25px; color: #1e293b;">Message:</h3>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; color: #334155; white-space: pre-wrap;">${message}</div>
            
            <p style="margin-top: 30px; font-size: 12px; color: #64748b; text-align: center;">
              This notification was generated automatically by your website's contact form.
            </p>
          </div>
        `.trim(),
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("Resend API Error:", data);
      return new Response(
        JSON.stringify({ error: data.message || "Failed to send email via Resend" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ ok: true, message: "Email sent successfully" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Function error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
