## 2024-05-18 - Explicit ID and htmlFor Attributes Ensure Accessibility

**Learning:** Relying solely on implicit DOM nesting for form labeling by wrapping inputs inside label elements can be less effective or unsupported for certain screen readers, failing strict accessibility checks.
**Action:** Always provide explicit `id` attributes on form fields (like `<input>` or `<textarea>`) and matching `htmlFor` attributes on their corresponding `<label>` components.

## 2026-05-23 - Form Validation and Async Status Accessibility
**Learning:** Screen readers may not announce validation errors or asynchronous form status updates (success/error/missing-key) unless explicitly linked and wrapped in a live region.
**Action:** Always link validation error messages to inputs using the `aria-describedby` attribute and wrap asynchronous form submission status text in an `aria-live="polite"` container.
