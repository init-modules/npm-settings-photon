// src/helpers/locales.ts
var PHOTON_LOCALE_STATUSES = [
  "active",
  "draft",
  "inactive"
];
var normalizePhotonLocaleItem = (value, fallbackCode = "ru", index = 0) => {
  const code = typeof value?.code === "string" && value.code.trim() !== "" ? value.code.trim().toLowerCase() : fallbackCode;
  const label = typeof value?.label === "string" && value.label.trim() !== "" ? value.label.trim() : code.toUpperCase();
  const status = PHOTON_LOCALE_STATUSES.includes(
    value?.status
  ) ? value?.status : "active";
  return {
    code,
    label,
    status,
    isDefault: Boolean(value?.isDefault),
    sortOrder: typeof value?.sortOrder === "number" && Number.isFinite(value.sortOrder) ? value.sortOrder : index
  };
};
var normalizePhotonLocaleItems = (values, defaultLocale = "ru") => {
  if (!Array.isArray(values)) {
    return [
      normalizePhotonLocaleItem({
        code: defaultLocale,
        isDefault: true
      })
    ];
  }
  return values.map(
    (item, index) => normalizePhotonLocaleItem(
      typeof item === "object" && item !== null ? item : null,
      defaultLocale,
      index
    )
  );
};
var parsePhotonLocaleCodes = (value, _fallback = ["ru", "en"]) => (value ?? "").split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
var resolvePhotonLocaleCodes = (value, fallback = ["ru", "en"]) => {
  const parsed = parsePhotonLocaleCodes(value, fallback);
  return parsed.length > 0 ? parsed : fallback;
};
var bySortOrder = (left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0);
var resolvePhotonActiveLocales = (locales) => locales.filter((locale) => locale.status === "active").sort(bySortOrder);
var resolvePhotonEditableLocales = (locales) => locales.filter((locale) => locale.status === "active" || locale.status === "draft").sort(bySortOrder);

export {
  PHOTON_LOCALE_STATUSES,
  normalizePhotonLocaleItem,
  normalizePhotonLocaleItems,
  parsePhotonLocaleCodes,
  resolvePhotonLocaleCodes,
  resolvePhotonActiveLocales,
  resolvePhotonEditableLocales
};
