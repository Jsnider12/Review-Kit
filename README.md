# Roamwithin

A V1 vacation planning preview. Enter a departure city or airport, a total group budget, traveler count, and trip length to explore complete vacation concepts.

## Develop and verify

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run test:v1` (run after a production build)

The V1 checks exercise departure regions, budget limits, full-trip arithmetic, Surprise Me affordability, departure-city exclusion, and lodging checkout dates.

## Preview scope

All prices are modeled estimates in USD for the whole group. Transportation, lodging, daily spending, activities, and a buffer are included. Exact dates are planning inputs and do not change demo prices. International and unrecognized departures use neutral catalog transportation assumptions; recognized US regions use coarse regional adjustments. This is not live inventory, and booking is unavailable.

Saved trips are stored in this browser on this device; they do not sync to an account. Photo failures fall back to destination labels. Searches time out after 15 seconds and offer a retry.

The preview deliberately requests no search indexing. Connect live pricing and review public-launch metadata before a production launch. Development stays on `travel-prototype`; do not merge it to `main` without the owner's instruction.
