## 2024-05-18 - Explicit ID and htmlFor Attributes Ensure Accessibility

**Learning:** Relying solely on implicit DOM nesting for form labeling by wrapping inputs inside label elements can be less effective or unsupported for certain screen readers, failing strict accessibility checks.
**Action:** Always provide explicit `id` attributes on form fields (like `<input>` or `<textarea>`) and matching `htmlFor` attributes on their corresponding `<label>` components.

## 2024-05-25 - Improved Form Accessibility with aria-live and aria-describedby
**Learning:** For asynchronous form submissions, wrapping the status messages (like success, error, or loading states) in an `aria-live="polite"` container ensures that screen readers announce these changes without disrupting the user's workflow. Additionally, linking form fields directly to their respective error messages using `aria-describedby` (by passing a unique `errorId` to the field and its error message) provides clear, context-specific validation feedback for users relying on assistive technologies.
**Action:** Always wrap asynchronous form feedback messages in `aria-live` regions, and ensure all inputs with validation errors have an explicit `aria-describedby` linkage to their corresponding error text.
