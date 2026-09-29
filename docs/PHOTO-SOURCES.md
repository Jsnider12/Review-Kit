# Travel imagery integration

Roamwithin currently uses credited destination photography and image fallbacks. Only the demo travel provider is enabled; no hotel-photo API connection is active.

Booking.com Demand's accommodation-details endpoint supports requesting `photos`, including a main property photo and URLs at different sizes:
https://developers.booking.com/demand/docs/accommodations/look-accommodation-details

The Expedia Rapid room-content schema also exposes images:
https://opensource.expediagroup.com/rapid-java-sdk/rapid-sdk/com.expediagroup.sdk.rapid.models/-room-content/-room-content.html

## Intended presentation

- Keep destination photography on discovery cards while the suggestion is a vacation concept.
- Show provider property photos only after a specific hotel is selected; match photos to the same property ID as the quote.
- Label hotel photos with the property name. Avoid presenting destination imagery as a photo of the recommended hotel.
- Keep captions and any provider-required attribution, display, caching and retention rules together with the image metadata. Confirm the approved partner agreement before enabling images publicly.
- Use a destination fallback when a provider photo fails or is unavailable; keep demo estimates labeled until actual inventory is connected.

Approved partner access and credentials are prerequisites for live integration. An image endpoint does not by itself grant unrestricted reuse of its content.
