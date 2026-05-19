## 2024-05-18 - Explicit ID and htmlFor Attributes Ensure Accessibility

**Learning:** Relying solely on implicit DOM nesting for form labeling by wrapping inputs inside label elements can be less effective or unsupported for certain screen readers, failing strict accessibility checks.
**Action:** Always provide explicit `id` attributes on form fields (like `<input>` or `<textarea>`) and matching `htmlFor` attributes on their corresponding `<label>` components.
