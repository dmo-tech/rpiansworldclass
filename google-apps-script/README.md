# RPIANS Website Leads – Google Apps Script

`Code.gs` receives every form from the website and writes it to the right tab
of the **RPIANS Website Leads** Google Sheet:

| Website form | Sheet tab |
|---|---|
| `/register` form (and any other lead form) | **Leads** |
| "Get Started" form on the video | **video form data** |
| Book a Call page (`/book-call`) | **calender book data & form data** |
| Video watch tracking (one row per viewing session) | **video watch data** |

If a tab is missing, the script creates it with a bold header row.

## How to update the script (keeps the same URL)

Do this **before** pushing the new website code. The new script also understands
the current website, so nothing breaks in between.

1. Open the **RPIANS Website Leads** Google Sheet.
2. Click **Extensions → Apps Script**.
3. Open the file **Code.gs** on the left.
4. Select everything in it (**Ctrl + A**) and delete it.
5. Copy the whole content of `google-apps-script/Code.gs` from this repo and paste it in.
6. Click **Save** (the disk icon, or **Ctrl + S**).
7. Click **Deploy → Manage deployments**.
8. Find the existing **Web app** deployment and click the **pencil (Edit)** icon.
9. Under **Version**, choose **New version**.
10. Leave **Execute as: Me** and **Who has access: Anyone** as they are.
11. Click **Deploy**, then **Done**.

That's it. The **Web app URL stays the same**, so the website doesn't need any
change for the URL.

> Don't use **Deploy → New deployment**. That creates a **new** URL, and the
> website would keep sending data to the old one.

## How to check it works

- Open the Web app URL in your browser. You should see:
  `{"success":true,"message":"RPIANS website leads endpoint is running."}`
- Submit a test on the website (for example the Book a Call page) and check
  that a new row appears in the right tab.

If Google asks for permission the first time (Review permissions → choose
your account → Allow), that's normal: the script needs access to edit this sheet.

## Good to know

- **Date** is India time (Asia/Kolkata), written as `dd/MM/yyyy HH:mm:ss`.
- **Status** / **Lead Status** starts as `New` for every new row.
- **Leads tab:** the first 11 columns stay exactly where they are now
  (Date … Biggest Challenge, Lead Source, Lead Status). New columns
  (Selected Plan, Amount, Call Date, Call Time) are added at the **end**, so
  old rows don't move.
- Existing column names are never changed. Only empty header cells are filled.
- **video watch data:** each viewing session is one row that updates as the
  visitor watches (Seconds Watched, Percent Watched, Completed, Last Event).
  The old "Video Views" tab is left as it is.
- Two submissions at the same moment are handled one after the other
  (LockService), so rows never overwrite each other.
