# Realtime Conveyancer website

Redesign of realtimeconveyancer.com.au, matched to the Pathway to Settlement app redesign.

## Tech stack

- **HTML** for page structure
- **CSS** for styling (brand colours and spacing as CSS variables in `assets/css/tokens.css`)
- **JavaScript** (plain, no framework) for the menu and animations
- **Montserrat** from Google Fonts

No install or build step needed.

## Run it locally

1. Open this folder in **VS Code**.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `index.html` and choose **Open with Live Server**.

Use Live Server rather than double-clicking the file. Links and images use paths
starting with `/`, which need a local server to work (exactly like the live site).

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial project structure"
git branch -M main
git remote add origin https://github.com/<your-org>/realtime-conveyancer-website.git
git push -u origin main
```

## Folder structure

```
index.html                         Homepage (all copy in place, sections unstyled)
features/index.html                Inner pages: each folder = a page URL,
tms/index.html                     matching the current site so old links
pts/index.html                     and Google rankings keep working
realtime-conveyancer-calculator/
case-studies/
frequently-asked-questions/
contact-us/
book-a-demo/
assets/
  css/
    main.css                       Loads all the CSS files below
    tokens.css                     Brand colours, type, spacing, radius
    base.css                       Reset and global defaults
    components.css                 Buttons, badges, cards
    layout/header.css, footer.css
    sections/                      One CSS file per homepage section
  js/
    main.js                        Mobile menu, footer year
    hero.js                        Hero animation
    count-up.js                    Proof strip numbers
  images/
    hero/  app-screens/  testimonials/  awards/  resources/  logos/  icons/
content/
  homepage-copy.md                 All homepage copy, for client sign-off
```

## Images to add

- `assets/images/logos/`: `rtc-logo.svg`, `rtc-logo-white.svg`, `favicon.png`
- `assets/images/hero/`: your hero images
- `assets/images/app-screens/`: real screenshots from the redesigned app
- `assets/images/testimonials/`: `brad-eckermann.jpg`, `peter-fletcher.jpg`, `liley.jpg`, `suzanne-sanders.jpg`, `brooke-oconnor.jpg`
- `assets/images/awards/`, `assets/images/resources/`: award logos, whitepaper covers

## Build order (one section at a time)

1. Hero (with animation)
2. Proof strip
3. Problem → solution
4. For your practice
5. For your clients
6. Secure settlement
7. Calculator teaser
8. How switching works
9. Testimonials
10. Resources
11. Final CTA
12. Header and footer polish

## Going live

If the site stays on HubSpot, these pages convert into a HubSpot theme
(header and footer become global partials, sections become modules).
Otherwise it can be hosted anywhere that serves static files.
