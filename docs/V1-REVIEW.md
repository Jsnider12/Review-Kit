# Roamwithin V1 review

Review branch: `travel-prototype`. Do not merge to main.

The planning preview uses demo estimates, not live fares or bookable inventory. Saves are stored in the current browser; account synchronization and checkout are not implemented. Exact dates describe the proposed itinerary and do not imply live availability or date-sensitive prices. International departure pricing remains a coarse demo model.

## Verified

- Local production build and `npm run test:v1` passed.
- Vercel successfully deployed code commit `cdad7906a7e6cf548b5f9606ccd5cbedac05cfa7`.
- Browser checks covered city/airport suggestions, dedicated search results, saved-trip persistence and original search context, complete scrollable trip details, customization totals, and Surprise Me within budget.
- Results now show trip names and estimated prices in the initial desktop viewport, with search controls behind Edit search.
- The first three Houston results load credited destination photographs. See `v1-review-results.jpg`.
- Open dialogs make background content inert; existing focus trapping, Escape dismissal, and focus restoration remain in place.

- Responsive browser frames at 320px, 390px and 768px were reviewed. Phone results show the first trip title and price without scrolling; narrow trip details remain readable, with the bottom and close control reachable. No horizontal document overflow was observed at 320px or 768px. See `v1-mobile-review.jpg` and `/review-mobile.html`.
- Comparison selection provides guidance and a fixed View comparison action; the comparison includes transportation, stay, spending, budget room and an explicit demo-estimate label.
- A $100 search returns an actionable no-match state. Budget reduction respects the $100 minimum and cannot raise the budget.
- New Orleans shortening was verified: $1,548 / four days became $1,189 / three days, and Undo restored the original estimate and duration. Two-day trips do not offer a further one-night reduction.

## Review limits

Responsive layouts were tested in real browser frames, not a physical phone. Device-specific touch behavior and the iOS/Android software keyboard still require device validation. Automated assertions exercise the pricing engine and API handlers directly, rather than an HTTP server. Some destinations use the designed image fallback. The preview intentionally remains noindex until a public launch is approved.
