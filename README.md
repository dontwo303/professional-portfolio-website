# DIGITAL ARUN portfolio

A responsive, content-driven website for DIGITAL ARUN, built with a lightweight static generator and FormSubmit for contact inquiries. It includes Home, About, Services, seven service details, Blog, six sample articles, Contact, a consultation request page, and legal pages.

## Run locally

```sh
npm run build
npm run serve
```

The build writes the site to `dist/`. `npm run serve` previews it at `http://localhost:4173/` and handles `/api/contact` submissions from tabs that were opened before the direct FormSubmit configuration was built. Once FormSubmit is activated for the destination address, forms can submit from this preview as well as the deployed site.

## Content and configuration

- Edit homepage copy and the consultation form in `content/home.mjs`. Edit other page and service copy in `build.mjs`.
- Add, edit, or remove blog posts in `content/articles.json`. Each article is one JSON object; set `status` to `published` to include it in the build. Every article is currently labeled as a **sample**. Replace or approve this content before presenting it as Arun's published work.
- Replace `assets/logo-digital-arun.png` if the final brand logo changes.
- Replace the profile placeholder with Arun's approved portrait and personal details.
- Edit the privacy and terms copy to match the final business setup and have it reviewed before public launch.

The current consultation path is a **request form**, available on the homepage and `/book-consultation/`. It collects the visitor's business details and marketing challenge. It does not display appointment availability or claim that a booking is confirmed. Arun follows up by email to arrange a time.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `SITE_URL` | Public site origin for canonical links, Open Graph URLs, and sitemap, e.g. `https://example.com` |
| `CONTACT_EMAIL` | Destination for inquiries; defaults to `arunthapaa962@gmail.com` |
| `CONTACT_ENDPOINT` | Optional: `/api/contact` to use the Vercel validation function instead of direct FormSubmit AJAX |

By default, the forms send directly to FormSubmit's AJAX endpoint for `CONTACT_EMAIL`. The HTML `action` provides a standard POST fallback. For Vercel, setting `CONTACT_ENDPOINT=/api/contact` routes submissions through `api/contact.js` for additional server validation before forwarding to FormSubmit. Set the same `CONTACT_EMAIL` for the build and function runtime in that case.

FormSubmit requires the destination address to be activated from an email it sends after the first submission. Until that link is clicked, an accepted form response does not prove delivery to the inbox. Check the inbox and spam folder, activate the form, and submit another test inquiry to verify receipt.

## Deploy to Vercel

1. Import this repository as a Vercel project with the repository root as the Root Directory.
2. Set the environment variables above for Production (and Preview if needed).
3. Deploy. `vercel.json` runs `npm run build` and serves `dist/`. The optional `api/contact.js` Vercel Function is available if `CONTACT_ENDPOINT=/api/contact` is set.
4. Activate FormSubmit for the destination email, then test a real inquiry and verify receipt.
5. Test a consultation request and verify that it arrives by email. Direct scheduling can be added later if desired.

No client testimonials, case studies, qualifications, or results are invented in the site.
