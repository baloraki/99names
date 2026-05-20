## 2024-05-18 - Explicit ID and htmlFor Attributes Ensure Accessibility

**Learning:** Relying solely on implicit DOM nesting for form labeling by wrapping inputs inside label elements can be less effective or unsupported for certain screen readers, failing strict accessibility checks.
**Action:** Always provide explicit `id` attributes on form fields (like `<input>` or `<textarea>`) and matching `htmlFor` attributes on their corresponding `<label>` components.

## 2026-05-20 - Ensure Error Messages are Announced by Screen Readers

**Learning:** When displaying validation errors near form inputs, visually conveying the error isn't enough for screen reader users. Without a programmatic link, the screen reader might not associate the error message with the input field.
**Action:** Always link validation error messages to their corresponding inputs using the `aria-describedby` attribute, pointing to the `id` of the element containing the error message.
