import {
  PHOTON_LOCALE_STATUSES,
  normalizePhotonLocaleItem,
  normalizePhotonLocaleItems,
  parsePhotonLocaleCodes,
  resolvePhotonActiveLocales,
  resolvePhotonEditableLocales,
  resolvePhotonLocaleCodes
} from "./chunk-DKZNIYZX.js";

// src/module.tsx
import {
  createPhotonKit,
  usePhotonI18n
} from "@init/photon/public";
import { useMemo } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var localeStatusOptions = [
  {
    label: "Active",
    labelKey: "settingsPhoton.locales.status.active.label",
    value: "active"
  },
  {
    label: "Draft",
    labelKey: "settingsPhoton.locales.status.draft.label",
    value: "draft"
  },
  {
    label: "Inactive",
    labelKey: "settingsPhoton.locales.status.inactive.label",
    value: "inactive"
  }
];
var infoCardStyle = {
  borderColor: "var(--photon-builder-border)",
  background: "linear-gradient(180deg, color-mix(in srgb, var(--photon-builder-accent) 10%, transparent), var(--photon-builder-panel-muted))",
  color: "var(--photon-builder-text)"
};
var chipStyle = {
  borderColor: "var(--photon-builder-border)",
  background: "var(--photon-builder-panel-solid)",
  color: "var(--photon-builder-text-soft)"
};
var rowStyle = {
  borderColor: "var(--photon-builder-border)",
  background: "var(--photon-builder-panel-muted)",
  color: "var(--photon-builder-text)"
};
var inputStyle = {
  borderColor: "var(--photon-builder-border)",
  background: "var(--photon-builder-field)",
  color: "var(--photon-builder-text)"
};
var accentButtonStyle = {
  borderColor: "var(--photon-builder-border-strong)",
  background: "var(--photon-builder-accent-soft)",
  color: "var(--photon-builder-accent-text)"
};
var neutralButtonStyle = {
  borderColor: "var(--photon-builder-border)",
  background: "var(--photon-builder-panel-solid)",
  color: "var(--photon-builder-text)"
};
var LocaleRowEditor = ({
  locale,
  index,
  total,
  onChange,
  onRemove,
  onToggleDefault
}) => {
  const { translate } = usePhotonI18n();
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
              style: { color: "var(--photon-builder-text-soft)" },
              children: translate("settingsPhoton.locales.code.label", "Code")
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
              className: "w-full rounded-[1.1rem] border px-3 py-2.5 text-sm outline-none transition placeholder:text-[color:var(--photon-builder-text-ghost)]",
              style: inputStyle
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "mb-2 text-[11px] uppercase tracking-[0.24em]",
              style: { color: "var(--photon-builder-text-soft)" },
              children: translate("settingsPhoton.locales.label.label", "Label")
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
              className: "w-full rounded-[1.1rem] border px-3 py-2.5 text-sm outline-none transition placeholder:text-[color:var(--photon-builder-text-ghost)]",
              style: inputStyle
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "mb-2 text-[11px] uppercase tracking-[0.24em]",
              style: { color: "var(--photon-builder-text-soft)" },
              children: translate("settingsPhoton.locales.status.label", "Status")
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
              style: { color: "var(--photon-builder-text-soft)" },
              children: translate(
                "settingsPhoton.locales.sortOrder.label",
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
              children: locale.isDefault ? translate(
                "settingsPhoton.locales.default.label",
                "Default"
              ) : translate(
                "settingsPhoton.locales.makeDefault.label",
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
              children: translate("settingsPhoton.locales.remove.label", "Remove")
            }
          )
        ] })
      ]
    }
  );
};
var LocalesSettingsPanel = ({ getValue, setValue }) => {
  const { translate } = usePhotonI18n();
  const rawLocales = getValue("items");
  const locales = useMemo(
    () => normalizePhotonLocaleItems(rawLocales),
    [rawLocales]
  );
  const activeLocales = resolvePhotonActiveLocales(locales);
  const editableLocales = resolvePhotonEditableLocales(locales);
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
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "rounded-2xl border px-4 py-3 text-sm leading-6",
        style: infoCardStyle,
        children: translate(
          "settingsPhoton.locales.description",
          "Active locales are public. Draft locales are editable but hidden from the frontend. Inactive locales stay parked until they are re-enabled."
        )
      }
    ),
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
          children: translate(
            "settingsPhoton.locales.add.label",
            "Add locale"
          )
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
  labelKey: "settingsPhoton.locales.panel.label",
  description: "Global locale registry for the photon and frontend runtime.",
  descriptionKey: "settingsPhoton.locales.panel.description",
  order: 5,
  component: LocalesSettingsPanel
};
var settingsPhotonModule = {
  module: "settings-photon",
  label: "Settings Photon",
  labelKey: "settingsPhoton.module.label",
  version: "0.1.0",
  blocks: [],
  siteSettingsPanels: [siteLocalesSettingsPanel]
};
var settingsPhotonKit = createPhotonKit({
  key: "settings-photon",
  label: "Settings Photon",
  modules: [settingsPhotonModule]
});
export {
  PHOTON_LOCALE_STATUSES,
  normalizePhotonLocaleItem,
  normalizePhotonLocaleItems,
  parsePhotonLocaleCodes,
  resolvePhotonActiveLocales,
  resolvePhotonEditableLocales,
  resolvePhotonLocaleCodes,
  settingsPhotonKit,
  settingsPhotonModule,
  siteLocalesSettingsPanel
};
