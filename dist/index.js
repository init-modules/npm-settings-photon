import {
  WEBSITE_BUILDER_LOCALE_STATUSES,
  normalizeWebsiteBuilderLocaleItem,
  normalizeWebsiteBuilderLocaleItems,
  parseWebsiteBuilderLocaleCodes,
  resolveWebsiteBuilderActiveLocales,
  resolveWebsiteBuilderEditableLocales,
  resolveWebsiteBuilderLocaleCodes
} from "./chunk-R7IN3LYS.js";

// src/module.tsx
import {
  createWebsiteBuilderKit,
  useWebsiteBuilderI18n
} from "@init-modules/website-builder/public";
import { useMemo } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var localeStatusOptions = [
  {
    label: "Active",
    labelKey: "settingsWebsiteBuilder.locales.status.active.label",
    value: "active"
  },
  {
    label: "Draft",
    labelKey: "settingsWebsiteBuilder.locales.status.draft.label",
    value: "draft"
  },
  {
    label: "Inactive",
    labelKey: "settingsWebsiteBuilder.locales.status.inactive.label",
    value: "inactive"
  }
];
var infoCardStyle = {
  borderColor: "var(--wb-builder-border)",
  background: "linear-gradient(180deg, color-mix(in srgb, var(--wb-builder-accent) 10%, transparent), var(--wb-builder-panel-muted))",
  color: "var(--wb-builder-text)"
};
var chipStyle = {
  borderColor: "var(--wb-builder-border)",
  background: "var(--wb-builder-panel-solid)",
  color: "var(--wb-builder-text-soft)"
};
var rowStyle = {
  borderColor: "var(--wb-builder-border)",
  background: "var(--wb-builder-panel-muted)",
  color: "var(--wb-builder-text)"
};
var inputStyle = {
  borderColor: "var(--wb-builder-border)",
  background: "var(--wb-builder-field)",
  color: "var(--wb-builder-text)"
};
var accentButtonStyle = {
  borderColor: "var(--wb-builder-border-strong)",
  background: "var(--wb-builder-accent-soft)",
  color: "var(--wb-builder-accent-text)"
};
var neutralButtonStyle = {
  borderColor: "var(--wb-builder-border)",
  background: "var(--wb-builder-panel-solid)",
  color: "var(--wb-builder-text)"
};
var LocaleRowEditor = ({
  locale,
  index,
  total,
  onChange,
  onRemove,
  onToggleDefault
}) => {
  const { translate } = useWebsiteBuilderI18n();
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "grid gap-3 rounded-2xl border p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_11rem_9rem_auto] md:items-end",
      style: rowStyle,
      children: [
        /* @__PURE__ */ jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "mb-2 text-[11px] uppercase tracking-[0.24em]",
              style: { color: "var(--wb-builder-text-soft)" },
              children: translate("settingsWebsiteBuilder.locales.code.label", "Code")
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: locale.code,
              onChange: (event) => onChange({
                ...locale,
                code: event.currentTarget.value
              }),
              className: "w-full rounded-[1.1rem] border px-3 py-2.5 text-sm outline-none transition placeholder:text-[color:var(--wb-builder-text-ghost)]",
              style: inputStyle
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "mb-2 text-[11px] uppercase tracking-[0.24em]",
              style: { color: "var(--wb-builder-text-soft)" },
              children: translate("settingsWebsiteBuilder.locales.label.label", "Label")
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: locale.label,
              onChange: (event) => onChange({
                ...locale,
                label: event.currentTarget.value
              }),
              className: "w-full rounded-[1.1rem] border px-3 py-2.5 text-sm outline-none transition placeholder:text-[color:var(--wb-builder-text-ghost)]",
              style: inputStyle
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "mb-2 text-[11px] uppercase tracking-[0.24em]",
              style: { color: "var(--wb-builder-text-soft)" },
              children: translate("settingsWebsiteBuilder.locales.status.label", "Status")
            }
          ),
          /* @__PURE__ */ jsx(
            "select",
            {
              value: locale.status,
              onChange: (event) => {
                const status = event.currentTarget.value;
                onChange({
                  ...locale,
                  status,
                  isDefault: status === "inactive" ? false : locale.isDefault
                });
              },
              className: "w-full rounded-[1.1rem] border px-3 py-2.5 text-sm outline-none transition",
              style: inputStyle,
              children: localeStatusOptions.map((option) => /* @__PURE__ */ jsx("option", { value: option.value, children: translate(option.labelKey, option.label) }, option.value))
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "mb-2 text-[11px] uppercase tracking-[0.24em]",
              style: { color: "var(--wb-builder-text-soft)" },
              children: translate(
                "settingsWebsiteBuilder.locales.sortOrder.label",
                "Sort order"
              )
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              value: locale.sortOrder ?? index,
              onChange: (event) => onChange({
                ...locale,
                sortOrder: Number(event.currentTarget.value)
              }),
              className: "w-full rounded-[1.1rem] border px-3 py-2.5 text-sm outline-none transition",
              style: inputStyle
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onToggleDefault,
              className: "inline-flex h-10 items-center rounded-full border px-3 text-xs font-semibold uppercase tracking-[0.22em] transition",
              style: accentButtonStyle,
              children: locale.isDefault ? translate("settingsWebsiteBuilder.locales.default.label", "Default") : translate(
                "settingsWebsiteBuilder.locales.makeDefault.label",
                "Make default"
              )
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onRemove,
              disabled: total <= 1,
              className: "inline-flex h-10 items-center rounded-full border px-3 text-xs font-semibold uppercase tracking-[0.22em] transition disabled:cursor-not-allowed disabled:opacity-50",
              style: neutralButtonStyle,
              children: translate("settingsWebsiteBuilder.locales.remove.label", "Remove")
            }
          )
        ] })
      ]
    }
  );
};
var LocalesSettingsPanel = ({ getValue, setValue }) => {
  const { translate } = useWebsiteBuilderI18n();
  const rawLocales = getValue("items");
  const locales = useMemo(
    () => normalizeWebsiteBuilderLocaleItems(rawLocales),
    [rawLocales]
  );
  const activeLocales = resolveWebsiteBuilderActiveLocales(locales);
  const editableLocales = resolveWebsiteBuilderEditableLocales(locales);
  const commit = (nextLocales) => {
    const normalized = nextLocales.map((locale, index) => ({
      ...locale,
      sortOrder: typeof locale.sortOrder === "number" ? locale.sortOrder : index
    }));
    const hasDefault = normalized.some((locale) => locale.isDefault);
    const nextValue = hasDefault ? normalized : normalized.map(
      (locale, index) => index === 0 ? { ...locale, isDefault: true, status: "active" } : locale
    );
    setValue("items", nextValue);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsx("div", { className: "rounded-2xl border px-4 py-3 text-sm leading-6", style: infoCardStyle, children: translate(
      "settingsWebsiteBuilder.locales.description",
      "Active locales are public. Draft locales are editable but hidden from the frontend. Inactive locales stay parked until they are re-enabled."
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.24em]",
          style: chipStyle,
          children: `${activeLocales.length} public`
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.24em]",
          style: chipStyle,
          children: `${editableLocales.length} editable`
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.24em]",
          style: chipStyle,
          children: `${locales.length} total`
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => commit([
            ...locales,
            {
              code: `locale-${locales.length + 1}`,
              label: `Locale ${locales.length + 1}`,
              status: "draft",
              isDefault: false,
              sortOrder: locales.length
            }
          ]),
          className: "inline-flex h-10 items-center rounded-full border px-3 text-xs font-semibold uppercase tracking-[0.22em] transition",
          style: accentButtonStyle,
          children: translate("settingsWebsiteBuilder.locales.add.label", "Add locale")
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-3", children: locales.map((locale, index) => /* @__PURE__ */ jsx(
      LocaleRowEditor,
      {
        locale,
        index,
        total: locales.length,
        onChange: (nextLocale) => {
          const nextLocales = [...locales];
          nextLocales[index] = nextLocale;
          if (nextLocale.isDefault) {
            commit(
              nextLocales.map((item, itemIndex) => ({
                ...item,
                isDefault: itemIndex === index,
                status: itemIndex === index && item.status !== "active" ? "active" : item.status
              }))
            );
            return;
          }
          commit(nextLocales);
        },
        onToggleDefault: () => commit(
          locales.map((item, itemIndex) => ({
            ...item,
            isDefault: itemIndex === index,
            status: itemIndex === index && item.status !== "active" ? "active" : item.status
          }))
        ),
        onRemove: () => {
          const nextLocales = locales.filter(
            (_, itemIndex) => itemIndex !== index
          );
          commit(
            nextLocales.map((item, itemIndex) => ({
              ...item,
              isDefault: itemIndex === 0 ? nextLocales.length > 0 && !nextLocales.some((row) => row.isDefault) : item.isDefault
            }))
          );
        }
      },
      `${locale.code}:${index}`
    )) })
  ] });
};
var siteLocalesSettingsPanel = {
  key: "locales",
  label: "Locales",
  labelKey: "settingsWebsiteBuilder.locales.label",
  description: "Global locale registry for the website builder and frontend runtime.",
  descriptionKey: "settingsWebsiteBuilder.locales.description",
  order: 5,
  component: LocalesSettingsPanel
};
var settingsWebsiteBuilderModule = {
  module: "settings-website-builder",
  label: "Settings Website Builder",
  labelKey: "settingsWebsiteBuilder.module.label",
  version: "0.1.0",
  blocks: [],
  siteSettingsPanels: [siteLocalesSettingsPanel]
};
var settingsWebsiteBuilderKit = createWebsiteBuilderKit({
  key: "settings-website-builder",
  label: "Settings Website Builder",
  modules: [settingsWebsiteBuilderModule]
});
export {
  WEBSITE_BUILDER_LOCALE_STATUSES,
  normalizeWebsiteBuilderLocaleItem,
  normalizeWebsiteBuilderLocaleItems,
  parseWebsiteBuilderLocaleCodes,
  resolveWebsiteBuilderActiveLocales,
  resolveWebsiteBuilderEditableLocales,
  resolveWebsiteBuilderLocaleCodes,
  settingsWebsiteBuilderKit,
  settingsWebsiteBuilderModule,
  siteLocalesSettingsPanel
};
