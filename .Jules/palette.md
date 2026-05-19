## 2024-05-16 - Button Accessibility attributes
**Learning:** Found that some state-toggling buttons lacked `aria-pressed` to announce their status effectively to screen readers, and several custom interactive elements acting as buttons lacked `type="button"`.
**Action:** Added `aria-pressed` for boolean toggle states and `type="button"` on state-changing triggers across NameDetailClient, NameProgressActions, NamesExplorer, and SettingsClient. This prevents unintended form actions and improves keyboard and screen-reader accessibility.

## 2024-05-19 - Form Accessibility: Explicit Labeling and Error Associations
**Learning:** Implicit label nesting (e.g., `<label><input /></label>`) can be problematic for some older screen readers and complex form layouts. Explicitly pairing `id` and `htmlFor` properties creates a stronger programmatic relationship. Additionally, explicitly associating error messages with input fields using `aria-describedby` significantly improves the validation feedback experience for assistive technologies.
**Action:** When implementing forms, always use explicit `id` and `htmlFor` bindings instead of implicit DOM nesting. For inputs with validation, append an ID to the error message element and reference it in the input's `aria-describedby` attribute to link the validation context.
