## 2024-05-18 - Explicit ID and htmlFor Attributes Ensure Accessibility

**Learning:** Relying solely on implicit DOM nesting for form labeling by wrapping inputs inside label elements can be less effective or unsupported for certain screen readers, failing strict accessibility checks.
**Action:** Always provide explicit `id` attributes on form fields (like `<input>` or `<textarea>`) and matching `htmlFor` attributes on their corresponding `<label>` components.
## 2024-05-17 - Accessible Form Field Validation

**Learning:** Implicit `<label>` wrapping around form fields can sometimes fail to robustly associate error messages for screen readers, and nested block elements inside `<label>` might produce invalid HTML or accessibility issues depending on the screen reader.

**Action:** In forms, separate the `<label htmlFor="...">` and `<input id="...">`, and always link the validation error message to the field by assigning an `id` to the error and using `aria-describedby` on the input.
