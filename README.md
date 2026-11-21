# DIGITAL ARUN portfolio

A responsive, static portfolio site with separate pages for Home, About, Services, Blog, Contact, eight service details, and four sample articles.

## Build and preview

```sh
npm run build
npm run serve
```

The finished site is in `dist/` and can be hosted by any static host that serves directory `index.html` files.

Vercel uses the root `vercel.json` to run `npm run build` and deploy the generated `dist/` directory. Keep the Vercel project's Root Directory set to the repository root.

For absolute canonical URLs and a sitemap, set `SITE_URL` to the live site origin when building (for example, `https://example.com`). Without it, the build omits those tags and the sitemap instead of emitting a false URL.

## Before launch

Edit `site.config.js` and rebuild:

- `bookingUrl`: your Calendly or other public booking URL. Every free marketing plan CTA uses it when present; otherwise, the CTA opens the working contact form on the Contact page. The booking panel explains that direct scheduling is coming soon.
- `contactEndpoint`: set to FormSubmit's AJAX endpoint for `arunthapaa962@gmail.com`. The form validates and reports submission errors. The HTML form also has a normal POST fallback.
- `contactEmail`: set to `arunthapaa962@gmail.com`. `location` and social links are optional public details.

FormSubmit sends a confirmation email after the first submission. Open that email and activate the form before submissions can be delivered to the inbox. FormSubmit says it holds submissions until activation and forwards them afterward. If the site moves to a new public domain, submit and confirm the form again if prompted. Check spam if activation or inquiries do not appear.

Replace the portrait placeholder and sample blog articles with approved real content. No results, credentials, or personal history are fabricated.
