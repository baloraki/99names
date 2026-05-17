## 2024-05-16 - Button Accessibility attributes
**Learning:** Found that some state-toggling buttons lacked `aria-pressed` to announce their status effectively to screen readers, and several custom interactive elements acting as buttons lacked `type="button"`.
**Action:** Added `aria-pressed` for boolean toggle states and `type="button"` on state-changing triggers across NameDetailClient, NameProgressActions, NamesExplorer, and SettingsClient. This prevents unintended form actions and improves keyboard and screen-reader accessibility.
