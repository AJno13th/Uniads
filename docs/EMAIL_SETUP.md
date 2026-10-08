# UNIADS email setup — `info@uniads.co.uk`

Goal: a real mailbox you can log into, plus reliable lead alerts from the website.

**Current DNS (as of setup guide):** `uniads.co.uk` uses Namecheap **email forwarding** MX
(`eforward*.registrar-servers.com`). Forwarding is **not** a mailbox — you cannot log in
as `info@uniads.co.uk` until you buy Private Email (or another host) and create the box.

---

## Part A — Real mailbox access (you must do this in Namecheap)

### 1. Buy Namecheap Private Email

1. Sign in at [namecheap.com](https://www.namecheap.com/)
2. Open **Account → Dashboard → Private Email** (or search “Private Email” in the marketplace)
3. Purchase Private Email for **`uniads.co.uk`** (1 mailbox is enough to start)

Official start guide:  
https://www.namecheap.com/support/knowledgebase/article.aspx/1179/2176/how-to-start-using-namecheap-private-email/

### 2. Point DNS at Private Email (replace forwarding)

In **Domain List → uniads.co.uk → Advanced DNS**:

**Remove** the old forwarding MX records that point to `eforward*.registrar-servers.com`.

**Add** these Private Email records:

| Type | Host | Value | Priority |
| --- | --- | --- | --- |
| MX | `@` | `mx1.privateemail.com` | 10 |
| MX | `@` | `mx2.privateemail.com` | 10 |
| TXT | `@` | `v=spf1 include:spf.privateemail.com ~all` | — |

Also add the **DKIM** TXT record Namecheap shows on the Private Email page
(host is usually like `privateemail._domainkey`).

**Do not delete** Vercel / website records (A, CNAME, URL Redirect for `www` / root).
Only change mail-related MX / SPF / DKIM.

Wait up to ~30 minutes (sometimes a few hours) for activation.

### 3. Create the `info` mailbox

1. **Dashboard → Private Email → Manage** next to `uniads.co.uk`
2. **Create Mailbox**
3. Name: `info` → address becomes **`info@uniads.co.uk`**
4. Set a strong password and save

Guide:  
https://www.namecheap.com/support/knowledgebase/article.aspx/1049/2215/how-to-create-namecheap-private-email-mailbox/

### 4. Log in and test

- Webmail: https://privateemail.com  
- Username: `info@uniads.co.uk`  
- Password: the mailbox password you set  

Then:

1. Send yourself a test from Gmail/Outlook **to** `info@uniads.co.uk`
2. From webmail, reply / send **to** your personal address
3. Confirm both directions work (check spam)

Phone/desktop apps (optional):

| Setting | Value |
| --- | --- |
| Incoming IMAP | `mail.privateemail.com` · port `993` · SSL |
| Outgoing SMTP | `mail.privateemail.com` · port `465` · SSL |
| Username | full address `info@uniads.co.uk` |

---

## Part B — Website lead alerts (Vercel + Resend)

The CRM notifier (`src/lib/crm/notify.ts`) emails advisors when a lead is captured.

### 1. Create Resend account

1. Sign up at https://resend.com
2. **Domains → Add** `uniads.co.uk`
3. Add the DNS records Resend shows (SPF/DKIM).  
   If Private Email SPF already exists, merge includes, e.g.  
   `v=spf1 include:spf.privateemail.com include:amazonses.com ~all`  
   (use the exact include Resend displays)
4. Wait until Resend marks the domain **Verified**

### 2. Set Vercel environment variables

In **Vercel → uniads project → Settings → Environment Variables**:

| Variable | Value |
| --- | --- |
| `RESEND_API_KEY` | `re_...` from Resend |
| `RESEND_FROM_EMAIL` | `UNIADS Leads <info@uniads.co.uk>` (or `leads@uniads.co.uk` if you create that box) |
| `LEAD_NOTIFY_EMAIL` | `info@uniads.co.uk` |

Redeploy after saving.

### 3. Test

1. Submit a test enquiry on https://www.uniads.co.uk/apply (or `/ig`)
2. Confirm an alert arrives in the `info@` inbox
3. Optional: open `/api/health` — `emailNotify` should show `resend` when configured

Until Resend is set, the app falls back to FormSubmit (requires a one-time activation email to `info@…`).

---

## Checklist

- [ ] Private Email purchased for `uniads.co.uk`
- [ ] MX → `mx1` / `mx2.privateemail.com` (forwarding MX removed)
- [ ] SPF (+ DKIM) updated
- [ ] Mailbox `info@uniads.co.uk` created
- [ ] Login works at https://privateemail.com
- [ ] Send + receive test passed
- [ ] Resend domain verified
- [ ] Vercel `RESEND_*` + `LEAD_NOTIFY_EMAIL` set and redeployed
- [ ] Live form submission creates an alert in `info@`

---

## What the coding agent cannot do

Mailbox creation, DNS edits, and Vercel secret entry require **your** Namecheap / Resend / Vercel login.
Once Part A is done, `info@uniads.co.uk` is live with mailbox access; Part B makes lead alerts reliable.
