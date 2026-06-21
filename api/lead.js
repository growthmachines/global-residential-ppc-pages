// Lead handler — Vercel Serverless Function (Node.js, zero dependencies)
// ----------------------------------------------------------------------
// Drop-in replacement for the original thankyou.php.
// Works for ANY landing page in this repo. Forms POST to /api/lead and
// every submitted field is captured dynamically — no need to edit this
// file when adding new pages or new form fields.
//
// Required Vercel environment variables (Project → Settings → Environment Variables):
//   RESEND_API_KEY   — Resend.com API key (used to send the email)
//   LEAD_FROM        — sender address, e.g. "Global Residential <leads@lp.global-residential.com>"
//   LEAD_TO          — recipient(s), comma-separated, e.g. "kelly.yeung@global-residential.com,ahsan.azeem@useo.ae"
//
// Optional:
//   LEAD_REPLY_TO_FIELD — form field name to use as Reply-To (default: "email")
//
// REDIRECT BEHAVIOUR (after a successful send):
//   1. If the form includes a `redirect_to` field (relative path, same origin),
//      the user is redirected there. Use this to point at the campaign's own
//      thank-you page, e.g. <input type="hidden" name="redirect_to" value="/cyprus-properties/thank-you.html">
//   2. Otherwise the user is redirected to /thank-you.html (shared fallback).
//   3. AJAX / fetch requests get a 200 JSON response instead of a redirect.
//
// ----------------------------------------------------------------------
// TESTING MODE (no domain verification required)
// ----------------------------------------------------------------------
// Resend provides a sandbox sender — onboarding@resend.dev — that lets you
// test the entire pipeline (form → handler → email → thank-you page) without
// verifying a custom domain. The catch: it can ONLY deliver to the email
// address registered on your Resend account.
//
// To test:
//   1. Sign up at resend.com with the address you want test leads sent to
//   2. Create an API key, paste it into RESEND_API_KEY
//   3. Set LEAD_FROM=onboarding@resend.dev
//   4. Set LEAD_TO=<your resend account email>
//   5. Submit a form — the lead arrives in your inbox
//
// To go live (deliver to Kelly, Ahsan, etc.):
//   1. Verify a sending domain in Resend (DNS records on global-residential.com
//      or a subdomain like lp.global-residential.com)
//   2. Change LEAD_FROM to an address on the verified domain
//   3. Change LEAD_TO to the real recipient list
// ----------------------------------------------------------------------

// Fields that control the handler itself and must never be emailed as lead data.
const RESERVED_FIELDS = new Set([
  HONEYPOT_FIELD, // captured separately, see below
  "leadsource", // captured separately, see below
  "campaign", // captured separately, see below
  "redirect_to", // controls redirect target
]);

// Shared fallback thank-you page.
const DEFAULT_REDIRECT = "/thank-you.html";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

// Honeypot field name — if a bot fills this in, we silently drop the lead.
const HONEYPOT_FIELD = "website";

// Internal fields we never want to email to the team.
const INTERNAL_FIELDS = RESERVED_FIELDS;

// Pretty labels for known fields. Anything not listed falls back to a
// title-cased version of the field name.
const FIELD_LABELS = {
  full_name: "Full Name",
  email: "Email Address",
  phone_number: "Phone Number",
  full_phone_number: "Phone Number (E.164)",
  country: "Country",
  investment_budget: "Investment Budget",
  interested_development: "Interested Development",
  campaign: "Campaign",
  leadsource: "Lead Source",
  message: "Message",
  comments: "Message",
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function titleCase(name) {
  return name
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function labelFor(name) {
  return FIELD_LABELS[name] || titleCase(name);
}

// Build the branded HTML email body. Iterates whatever fields came in.
function buildEmailHtml(fields, meta) {
  const year = new Date().getFullYear();
  const rows = Object.entries(fields)
    .map(
      ([name, value]) => `
          <tr>
            <td class="label">${escapeHtml(labelFor(name))}</td>
            <td class="value">${escapeHtml(value)}</td>
          </tr>`
    )
    .join("");

  const campaignTag = meta.campaign ? ` — ${escapeHtml(meta.campaign)}` : "";
  const sourceTag = meta.leadsource ? ` (${escapeHtml(meta.leadsource)})` : "";

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
  .container { width: 100%; max-width: 600px; margin: 20px auto; border-radius: 10px; overflow: hidden; background: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
  .header { background-color: #28202d; color: #ffffff; padding: 20px; text-align: center; }
  .header h1 { margin: 0; font-size: 22px; font-weight: 500; letter-spacing: 1px; }
  .content { padding: 20px 30px 30px 30px; }
  .lead-info { width: 100%; border-collapse: collapse; margin-top: 20px; }
  .lead-info td { padding: 12px 15px; border-bottom: 1px solid #eeeeee; vertical-align: top; }
  .label { font-weight: 600; color: #28202d; width: 180px; }
  .value { color: #555555; }
  .footer { background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #888888; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>NEW LEAD RECEIVED${campaignTag}</h1>
    </div>
    <div class="content">
      <p>Hello Team, you have received a new inquiry from a landing page${sourceTag}.</p>
      <table class="lead-info">
        <tbody>${rows}
        </tbody>
      </table>
    </div>
    <div class="footer">
      <p>&copy; ${year} Global Residential. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

function buildEmailText(fields, meta) {
  const lines = Object.entries(fields).map(
    ([name, value]) => `${labelFor(name)}: ${value}`
  );
  const header =
    (meta.campaign ? `Campaign: ${meta.campaign}\n` : "") +
    (meta.leadsource ? `Lead Source: ${meta.leadsource}\n` : "") +
    "\n";
  return `NEW LEAD RECEIVED\n\n${header}${lines.join("\n")}`;
}

export default async function handler(req, res) {
  // Only accept POST.
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Vercel parses JSON and urlencoded bodies automatically. Fall back to a
  // manual parse for safety if we somehow receive a raw string.
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      const params = new URLSearchParams(body);
      body = Object.fromEntries(params);
    }
  }
  if (!body || typeof body !== "object") body = {};

  // --- Honeypot anti-spam ---
  // Pretend success so bots don't keep retrying.
  if (body[HONEYPOT_FIELD]) {
    return res.redirect(303, resolveRedirect(body));
  }

  // --- Extract + filter fields ---
  const { campaign, leadsource } = body;
  const fields = {};
  for (const [key, value] of Object.entries(body)) {
    if (INTERNAL_FIELDS.has(key)) continue;
    if (Array.isArray(value)) {
      fields[key] = value.join(", ");
    } else if (value !== undefined && value !== null && String(value).trim() !== "") {
      fields[key] = String(value).trim();
    }
  }

  // Many forms send both a display phone_number and a hidden full_phone_number
  // (E.164 from intlTelInput). Keep the E.164 one, drop the duplicate.
  if (fields.full_phone_number && fields.phone_number) {
    delete fields.phone_number;
  }

  if (Object.keys(fields).length === 0) {
    return res.status(400).json({ error: "No form fields received." });
  }

  // --- Config check ---
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_FROM;
  const to = process.env.LEAD_TO;
  if (!apiKey || !from || !to) {
    console.error("Lead handler missing env vars:", {
      hasKey: Boolean(apiKey),
      hasFrom: Boolean(from),
      hasTo: Boolean(to),
    });
    return res.status(500).json({
      error:
        "Lead handler not configured. Set RESEND_API_KEY, LEAD_FROM, LEAD_TO in Vercel.",
    });
  }

  const meta = {
    campaign: campaign || undefined,
    leadsource: leadsource || undefined,
  };

  const replyToField = process.env.LEAD_REPLY_TO_FIELD || "email";
  const replyTo = fields[replyToField] ? String(fields[replyToField]) : undefined;

  const subject = `Lead From Global Residential Landing Page${
    meta.campaign ? ` — ${meta.campaign}` : ""
  }`;

  const emailPayload = {
    from,
    to: to
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    subject,
    html: buildEmailHtml(fields, meta),
    text: buildEmailText(fields, meta),
  };
  if (replyTo) emailPayload.reply_to = replyTo;

  // --- Send via Resend ---
  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Resend API error:", response.status, errorText);
      return res.status(502).json({ error: "Email delivery failed." });
    }
  } catch (err) {
    console.error("Resend request threw:", err);
    return res.status(502).json({ error: "Email delivery failed." });
  }

  // --- Success ---
  const wantsJson =
    (req.headers.accept || "").includes("application/json") ||
    (req.headers["x-requested-with"] || "").toLowerCase() === "xmlhttprequest";

  if (wantsJson) {
    return res.status(200).json({ ok: true });
  }
  // Standard HTML form POST → redirect to the campaign's own thank-you page,
  // or the shared fallback if the form didn't specify one.
  return res.redirect(303, resolveRedirect(body));
}

// Resolve which thank-you page to show. Prefer the form's `redirect_to`
// field (campaign-specific), fall back to the shared default.
// Only same-origin relative paths are allowed — absolute URLs are rejected
// to prevent open-redirect abuse.
function resolveRedirect(body) {
  const requested = body.redirect_to;
  if (
    typeof requested === "string" &&
    requested.startsWith("/") &&
    !requested.startsWith("//")
  ) {
    return requested;
  }
  return DEFAULT_REDIRECT;
}
