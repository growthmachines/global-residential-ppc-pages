# Global Residential — Landing Pages

This repository hosts landing pages for PPC campaigns at `lp.global-residential.com`.

## How to add a new landing page

1. Create a new folder for your campaign (e.g., `cyprus-properties/`)
2. Add your `index.html`, CSS files, images, and any other assets inside that folder
3. Push to the `main` branch
4. Your page will be live within ~30 seconds at: `https://lp.global-residential.com/your-folder-name/`

### Example

A folder called `cyprus-properties/` with an `index.html` inside will be live at:
**https://lp.global-residential.com/cyprus-properties/**

## Folder structure

```
/
├── api/
│   └── lead.js              ← Lead form handler (shared by all pages — don't edit)
├── thank-you.html           ← Shared fallback thank-you page (don't edit)
├── cyprus-properties/       ← Campaign folder
│   ├── index.html
│   ├── thank-you.html       ← This campaign's own thank-you page
│   └── assets/
├── another-campaign/
│   ├── index.html
│   └── assets/
└── README.md
```

## Important notes

- Each campaign should be in its own folder
- The main entry point for each campaign should be named `index.html`
- All asset paths (CSS, images, JS) should be **relative** (e.g., `./styles.css`, `./images/hero.jpg`)
- Changes go live automatically when pushed to the `main` branch

---

## Lead forms

Every form on every landing page should submit to the **shared lead handler**:

```
/api/lead
```

This handler replaces the old PHP form. It collects whatever fields you put in
the form, packages them into a branded email, and sends it to the lead recipients.
You do **not** need to edit `api/lead.js` to add or change form fields — anything
in the form is captured automatically.

### How to wire up a form

Use `method="post"` and `action="/api/lead"`. Add the hidden control fields
shown below, then your normal form fields.

```html
<form method="post" action="/api/lead">
  <!-- Control fields (these are NOT emailed as lead data) -->
  <input type="hidden" name="campaign" value="Cyprus Properties">
  <input type="hidden" name="redirect_to" value="/cyprus-properties/thank-you.html">

  <!-- Honeypot anti-spam (keep hidden — bots fill this in, humans don't) -->
  <input type="text" name="website" style="display:none;" tabindex="-1" autocomplete="off">

  <!-- Your normal fields. Name them anything — all are captured. -->
  <input type="text" name="full_name" placeholder="Full Name*" required>
  <input type="email" name="email" placeholder="Email*" required>
  <input type="tel" name="phone_number" placeholder="Phone*" required>
  <!-- ...etc... -->

  <button type="submit">Submit</button>
</form>
```

### Control fields

These special fields configure the handler. They are not emailed as lead data.

| Field | Required? | Purpose |
|---|---|---|
| `campaign` | Recommended | Shown in the email subject line so the team can see which page generated the lead. E.g. `value="Cyprus Properties"` |
| `redirect_to` | Recommended | Where the user goes after submitting. Usually your campaign's own thank-you page, e.g. `value="/cyprus-properties/thank-you.html"`. If omitted, the shared `/thank-you.html` is used |
| `website` | Recommended | The honeypot. Must stay `display:none`. If filled in (by a bot), the submission is silently dropped |

### Your thank-you page

Each campaign should include its own thank-you page (e.g.
`cyprus-properties/thank-you.html`). This is yours to design — it should match
your campaign's styling. Point the form at it via the `redirect_to` field.

If a form is ever submitted without `redirect_to`, the user lands on the shared
`/thank-you.html` at the repo root as a fallback.

### Which lead fields get emailed?

**All of them**, except the control fields above (`campaign`, `redirect_to`,
`website`, `leadsource`). Whatever else is in your form — `full_name`, `email`,
`budget`, `message`, anything — is captured and emailed.

Common field names get nicer labels in the email (`full_name` → "Full Name",
`email` → "Email Address"). Anything else is title-cased automatically
(`investment_budget` → "Investment Budget").

### Things you cannot change without our help

These are configured on the hosting side, not in this repo. Email us to change:

- **Who receives the leads** (the `To:` address)
- **Who the email is from** (the `From:` address)
- **Email branding / template** (lives in `api/lead.js`)
- **Connecting the form to a CRM** instead of (or as well as) email

### Example: see `cyprus-properties/`

The Cyprus Properties page has two working forms (top of page + sidebar) wired
up exactly as described above. Copy that pattern for new campaigns.
