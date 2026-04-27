# Locale System Glossary

Domain terms for `@init/settings-photon` and the Photon i18n system.

## Core Concepts

### Locale
A language/region combination that represents one version of website content.

**Example:** EN, RU, DE, EN_US, ZH_HANS

**Properties:**
- **code**: Identifier (`en`, `ru`, `de_de`, etc.)
- **label**: Display name (`English`, `Russian`, etc.)
- **status**: Publication state (`active`, `draft`, `inactive`)
- **isDefault**: Whether this is the fallback locale
- **sortOrder**: Display order in UI (0-based)

### PhotonLocaleDescriptor
Type definition for a locale with all its properties.

```typescript
{
  code: string;           // "en"
  label: string;          // "English"
  status: PhotonLocaleStatus;  // "active" | "draft" | "inactive"
  isDefault?: boolean;    // true for one locale
  sortOrder?: number;     // 0, 1, 2, ...
}
```

### PhotonLocaleStatus

Publication state of a locale.

- **active** — Visible to public website visitors
- **draft** — Visible only to admin users, hidden from public
- **inactive** — Hidden from both public and admin (archived)

## Operations

### resolvePhotonActiveLocales(locales)

Filters a locale list to only active (published) locales.

**Input:** Array of all locale descriptors
**Output:** Array with `status === "active"`, sorted by sortOrder
**Use case:** Populate public locale switcher; determine which languages are available to visitors

**Example:**
```js
locales = [{code: "en", status: "active"}, {code: "ru", status: "draft"}]
publicLocales = resolvePhotonActiveLocales(locales)  // [{code: "en", ...}]
```

### resolvePhotonEditableLocales(locales)

Filters a locale list to active AND draft locales.

**Input:** Array of all locale descriptors
**Output:** Array with `status === "active" || "draft"`, sorted by sortOrder
**Use case:** Determine which locales admin can edit

**Example:**
```js
locales = [{code: "en", status: "active"}, {code: "ru", status: "draft"}, {code: "de", status: "inactive"}]
editableLocales = resolvePhotonEditableLocales(locales)  // [en, ru] (no de)
```

### normalizePhotonLocaleItems(values, defaultLocale)

Normalises raw locale data (from form, import, or API) into valid descriptors.

**Input:** Unknown data structure (array, single item, null)
**Output:** Array of PhotonLocaleDescriptor

**Normalisation rules:**
- Empty code → fallback to defaultLocale
- Uppercase code → converted to lowercase
- Hyphenated code → converted to underscore (en-US → en_us)
- Missing label → code.toUpperCase()
- Invalid status → "active"
- Missing sortOrder → index in array

**Example:**
```js
normalizePhotonLocaleItems([
  {code: "EN", label: "English"},
  {code: "RU-RU"}
])
// [{code: "en", label: "English", status: "active", sortOrder: 0}, 
//  {code: "ru_ru", label: "RU_RU", status: "active", sortOrder: 1}]
```

### normalizePhotonLocaleCode(code)

Normalises a single locale code.

**Rules:**
- Trim whitespace
- Convert to lowercase
- Replace hyphens with underscores

**Example:**
```js
normalizePhotonLocaleCode("  EN-US  ")  // "en_us"
```

### validatePhotonLocaleCode(code)

Checks if a code is valid format.

**Pattern:** `[a-z]{2}(_[a-z]{2,4})?`

Valid: en, ru, de, en_us, zh_hans, zh_hant
Invalid: EN, e, eng, en-us, 123

Note: `validatePhotonLocaleCode` validates raw input (case-sensitive). Run input through `normalizePhotonLocaleCode` first if you want to accept "EN" as valid "en".

**Example:**
```js
validatePhotonLocaleCode("en_us")  // true
validatePhotonLocaleCode("EN-US")  // false
```

## Storage

### site.settings.locales (Database)

Locales are persisted in the site settings object.

**Shape A (Flat Array):**
```json
[
  {"code": "en", "label": "EN", "status": "active", "isDefault": true, "sortOrder": 0},
  {"code": "ru", "label": "RU", "status": "draft", "isDefault": false, "sortOrder": 1}
]
```

**Shape B (Wrapped):**
```json
{
  "items": [
    {"code": "en", "label": "EN", ...}
  ]
}
```

Both shapes are supported by `normalizePhotonLocaleItems()`.

## UI Components

### LocalesSettingsPanel
React component for managing locales in the admin settings.

**Features:**
- Add new locale
- Edit code, label, status, sortOrder
- Toggle default locale
- Remove locale (soft delete)
- Summary: "X public, Y editable, Z total"

## Common Patterns

### Getting what admin can edit
```js
const editableLocales = resolvePhotonEditableLocales(site.settings.locales.items);
// Shows [active + draft], hidden [inactive]
```

### Getting what visitors see
```js
const publicLocales = resolvePhotonActiveLocales(site.settings.locales.items);
// Shows [active only]
// Use for public locale switcher
```

### Safely adding a new locale
```js
const newLocale = normalizePhotonLocaleItem({
  code: userInput.code,  // Will be normalised
  label: userInput.label
});
// Never trust raw user input
```

### When should I use what?

| Need | Use |
|------|-----|
| Populate public switcher | `resolvePhotonActiveLocales()` |
| Show admin what's editable | `resolvePhotonEditableLocales()` |
| Validate user locale input | `validatePhotonLocaleCode()` |
| Clean up locale code | `normalizePhotonLocaleCode()` |
| Process form data | `normalizePhotonLocaleItems()` |
