## 2024-05-18 - Explicit ID and htmlFor Attributes Ensure Accessibility

**Learning:** Relying solely on implicit DOM nesting for form labeling by wrapping inputs inside label elements can be less effective or unsupported for certain screen readers, failing strict accessibility checks.
**Action:** Always provide explicit `id` attributes on form fields (like `<input>` or `<textarea>`) and matching `htmlFor` attributes on their corresponding `<label>` components.

## 2024-05-22 - Form Validation Accessibility with Wrapper Components
**Learning:** When using custom wrapper components (like `Field`) to render validation error messages, inputs must explicitly link to those generated error elements using `aria-describedby`. Additionally, grouping submission status updates and honeypot validation messages in an `aria-live="polite"` container ensures screen readers correctly announce form submission results.
**Action:** Always verify that input fields have an `aria-describedby` attribute that corresponds to the `id` of their dynamically rendered error messages, especially when those messages are rendered by parent wrapper components. Use `aria-live="polite"` for asynchronous form submission statuses.
