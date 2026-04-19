// src/helpers/locales.ts
var WEBSITE_BUILDER_LOCALE_STATUSES = [
  "active",
  "draft",
  "inactive"
];
var normalizeWebsiteBuilderLocaleItem = (value, fallbackCode = "ru", index = 0) => {
  const code = typeof value?.code === "string" && value.code.trim() !== "" ? value.code.trim().toLowerCase() : fallbackCode;
  const label = typeof value?.label === "string" && value.label.trim() !== "" ? value.label.trim() : code.toUpperCase();
  const status = WEBSITE_BUILDER_LOCALE_STATUSES.includes(
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
var normalizeWebsiteBuilderLocaleItems = (values, defaultLocale = "ru") => {
  if (!Array.isArray(values)) {
    return [
      normalizeWebsiteBuilderLocaleItem({
        code: defaultLocale,
        isDefault: true
      })
    ];
  }
  return values.map(
    (item, index) => normalizeWebsiteBuilderLocaleItem(
      typeof item === "object" && item !== null ? item : null,
      defaultLocale,
      index
    )
  );
};
var parseWebsiteBuilderLocaleCodes = (value, fallback = ["ru", "en"]) => (value ?? "").split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
var resolveWebsiteBuilderLocaleCodes = (value, fallback = ["ru", "en"]) => {
  const parsed = parseWebsiteBuilderLocaleCodes(value, fallback);
  return parsed.length > 0 ? parsed : fallback;
};
var resolveWebsiteBuilderActiveLocales = (locales) => locales.filter((locale) => locale.status === "active").sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0));
var resolveWebsiteBuilderEditableLocales = (locales) => locales.filter((locale) => locale.status === "active" || locale.status === "draft").sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0));

export {
  WEBSITE_BUILDER_LOCALE_STATUSES,
  normalizeWebsiteBuilderLocaleItem,
  normalizeWebsiteBuilderLocaleItems,
  parseWebsiteBuilderLocaleCodes,
  resolveWebsiteBuilderLocaleCodes,
  resolveWebsiteBuilderActiveLocales,
  resolveWebsiteBuilderEditableLocales
};
