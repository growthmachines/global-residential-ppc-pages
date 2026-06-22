// Lead handler — Vercel Serverless Function (Node.js, CommonJS, zero dependencies)
// ----------------------------------------------------------------------
// Drop-in replacement for the original thankyou.php.
// Works for ANY landing page in this repo. Forms POST to /api/lead and
// every submitted field is captured dynamically — no need to edit this
// file when adding new pages or new form fields.
//
// Required Vercel environment variables (Project → Settings → Environment Variables):
//   RESEND_API_KEY   — Resend.com API key (used to send the email)
//   LEAD_FROM        — sender address, e.g. "Global Residential <leads@lp.global-residential.com>"
//   LEAD_TO          — recipient(s), comma-separated, e.g. "kelly.yeung@global-residential.com"
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
// ----------------------------------------------------------------------

var RESEND_ENDPOINT = "https://api.resend.com/emails";

// Honeypot field name — if a bot fills this in, we silently drop the lead.
var HONEYPOT_FIELD = "website";

// Fields that control the handler itself and must never be emailed as lead data.
var RESERVED_FIELDS = {
  website: true, // honeypot
  leadsource: true, // captured separately, see below
  campaign: true, // captured separately, see below
  redirect_to: true, // controls redirect target
};

// Shared fallback thank-you page.
var DEFAULT_REDIRECT = "/thank-you.html";

// Pretty labels for known fields. Anything not listed falls back to a
// title-cased version of the field name.
var FIELD_LABELS = {
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
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function titleCase(name) {
  return name
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, function (c) {
      return c.toUpperCase();
    });
}

function labelFor(name) {
  return FIELD_LABELS[name] || titleCase(name);
}

// Build the branded HTML email body. Iterates whatever fields came in.
function buildEmailHtml(fields, meta) {
  var year = new Date().getFullYear();
  var rows = "";
  Object.keys(fields).forEach(function (name) {
    rows +=
      '\n          <tr>\n            <td class="label">' +
      escapeHtml(labelFor(name)) +
      '</td>\n            <td class="value">' +
      escapeHtml(fields[name]) +
      "</td>\n          </tr>";
  });

  var campaignTag = meta.campaign ? " — " + escapeHtml(meta.campaign) : "";
  var sourceTag = meta.leadsource ? " (" + escapeHtml(meta.leadsource) + ")" : "";

  return (
    '<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<style>\n' +
    '  body { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }\n' +
    "  .container { width: 100%; max-width: 600px; margin: 20px auto; border-radius: 10px; overflow: hidden; background: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }\n" +
    "  .header { background-color: #28202d; color: #ffffff; padding: 20px; text-align: center; }\n" +
    "  .header h1 { margin: 0; font-size: 22px; font-weight: 500; letter-spacing: 1px; }\n" +
    "  .content { padding: 20px 30px 30px 30px; }\n" +
    "  .lead-info { width: 100%; border-collapse: collapse; margin-top: 20px; }\n" +
    "  .lead-info td { padding: 12px 15px; border-bottom: 1px solid #eeeeee; vertical-align: top; }\n" +
    "  .label { font-weight: 600; color: #28202d; width: 180px; }\n" +
    "  .value { color: #555555; }\n" +
    "  .footer { background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #888888; }\n" +
    '</style>\n</head>\n<body>\n  <div class="container">\n    <div class="header">\n      <h1>NEW LEAD RECEIVED' +
    campaignTag +
    "</h1>\n    </div>\n    <div class=\"content\">\n      <p>Hello Team, you have received a new inquiry from a landing page" +
    sourceTag +
    '.</p>\n      <table class="lead-info">\n        <tbody>' +
    rows +
    "\n        </tbody>\n      </table>\n    </div>\n    <div class=\"footer\">\n      <p>&copy; " +
    year +
    " Global Residential. All rights reserved.</p>\n    </div>\n  </div>\n</body>\n</html>"
  );
}

function buildEmailText(fields, meta) {
  var lines = [];
  Object.keys(fields).forEach(function (name) {
    lines.push(labelFor(name) + ": " + fields[name]);
  });
  var header = "";
  if (meta.campaign) header += "Campaign: " + meta.campaign + "\n";
  if (meta.leadsource) header += "Lead Source: " + meta.leadsource + "\n";
  header += "\n";
  return "NEW LEAD RECEIVED\n\n" + header + lines.join("\n");
}

// Resolve which thank-you page to show. Prefer the form's `redirect_to`
// field (campaign-specific), fall back to the shared default.
// Only same-origin relative paths are allowed — absolute URLs are rejected
// to prevent open-redirect abuse.
function resolveRedirect(body) {
  var requested = body.redirect_to;
  if (
    typeof requested === "string" &&
    requested.charAt(0) === "/" &&
    requested.charAt(1) !== "/"
  ) {
    return requested;
  }
  return DEFAULT_REDIRECT;
}

module.exports = function handler(req, res) {
  // Only accept POST.
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Vercel parses JSON and urlencoded bodies automatically. Fall back to a
  // manual parse for safety if we somehow receive a raw string.
  var body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      var params = {};
      new URLSearchParams(body).forEach(function (value, key) {
        params[key] = value;
      });
      body = params;
    }
  }
  if (!body || typeof body !== "object") body = {};

  // --- Honeypot anti-spam ---
  // Pretend success so bots don't keep retrying.
  if (body[HONEYPOT_FIELD]) {
    return res.redirect(303, resolveRedirect(body));
  }

  // --- Extract + filter fields ---
  var campaign = body.campaign;
  var leadsource = body.leadsource;
  var fields = {};
  Object.keys(body).forEach(function (key) {
    if (RESERVED_FIELDS[key]) return;
    var value = body[key];
    if (Array.isArray(value)) {
      fields[key] = value.join(", ");
    } else if (value !== undefined && value !== null && String(value).trim() !== "") {
      fields[key] = String(value).trim();
    }
  });

  // Many forms send both a display phone_number and a hidden full_phone_number
  // (E.164 from intlTelInput). Keep the E.164 one, drop the duplicate.
  if (fields.full_phone_number && fields.phone_number) {
    delete fields.phone_number;
  }

  if (Object.keys(fields).length === 0) {
    return res.status(400).json({ error: "No form fields received." });
  }

  // --- Config check ---
  var apiKey = process.env.RESEND_API_KEY;
  var from = process.env.LEAD_FROM;
  var to = process.env.LEAD_TO;
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

  var meta = {
    campaign: campaign || undefined,
    leadsource: leadsource || undefined,
  };

  var replyToField = process.env.LEAD_REPLY_TO_FIELD || "email";
  var replyTo = fields[replyToField] ? String(fields[replyToField]) : undefined;

  var subject = "Lead From Global Residential Landing Page" +
    (meta.campaign ? " — " + meta.campaign : "");

  var toList = to
    .split(",")
    .map(function (s) {
      return s.trim();
    })
    .filter(Boolean);

  var emailPayload = {
    from: from,
    to: toList,
    subject: subject,
    html: buildEmailHtml(fields, meta),
    text: buildEmailText(fields, meta),
  };
  if (replyTo) emailPayload.reply_to = replyTo;

  // --- Send via Resend ---
  fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailPayload),
  })
    .then(function (response) {
      if (!response.ok) {
        return response.text().then(function (errorText) {
          console.error("Resend API error:", response.status, errorText);
          return res.status(502).json({ error: "Email delivery failed." });
        });
      }
      // --- Success ---
      var acceptHeader = (req.headers.accept || "").toLowerCase();
      var xRequestedWith = (req.headers["x-requested-with"] || "").toLowerCase();
      var wantsJson =
        acceptHeader.indexOf("application/json") !== -1 ||
        xRequestedWith === "xmlhttprequest";

      if (wantsJson) {
        return res.status(200).json({ ok: true });
      }
      // Standard HTML form POST → redirect to the campaign's own thank-you page,
      // or the shared fallback if the form didn't specify one.
      return res.redirect(303, resolveRedirect(body));
    })
    .catch(function (err) {
      console.error("Resend request threw:", err);
      return res.status(502).json({ error: "Email delivery failed." });
    });
};
