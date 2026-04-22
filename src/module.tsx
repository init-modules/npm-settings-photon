import {
	createWebsiteBuilderKit,
	useWebsiteBuilderI18n,
	type WebsiteBuilderInstallableKit,
	type WebsiteBuilderLocaleStatus,
	type WebsiteBuilderModule,
	type WebsiteBuilderSiteSettingsPanelDefinition,
} from "@init-modules/website-builder/public";
import { useMemo } from "react";
import {
	normalizeWebsiteBuilderLocaleItems,
	resolveWebsiteBuilderActiveLocales,
	resolveWebsiteBuilderEditableLocales,
	type WebsiteBuilderLocaleItem,
} from "./helpers/locales";

const localeStatusOptions: Array<{
	label: string;
	labelKey: string;
	value: WebsiteBuilderLocaleStatus;
}> = [
	{
		label: "Active",
		labelKey: "settingsWebsiteBuilder.locales.status.active.label",
		value: "active",
	},
	{
		label: "Draft",
		labelKey: "settingsWebsiteBuilder.locales.status.draft.label",
		value: "draft",
	},
	{
		label: "Inactive",
		labelKey: "settingsWebsiteBuilder.locales.status.inactive.label",
		value: "inactive",
	},
];

const infoCardStyle = {
	borderColor: "var(--wb-builder-border)",
	background:
		"linear-gradient(180deg, color-mix(in srgb, var(--wb-builder-accent) 10%, transparent), var(--wb-builder-panel-muted))",
	color: "var(--wb-builder-text)",
};

const chipStyle = {
	borderColor: "var(--wb-builder-border)",
	background: "var(--wb-builder-panel-solid)",
	color: "var(--wb-builder-text-soft)",
};

const rowStyle = {
	borderColor: "var(--wb-builder-border)",
	background: "var(--wb-builder-panel-muted)",
	color: "var(--wb-builder-text)",
};

const inputStyle = {
	borderColor: "var(--wb-builder-border)",
	background: "var(--wb-builder-field)",
	color: "var(--wb-builder-text)",
};

const accentButtonStyle = {
	borderColor: "var(--wb-builder-border-strong)",
	background: "var(--wb-builder-accent-soft)",
	color: "var(--wb-builder-accent-text)",
};

const neutralButtonStyle = {
	borderColor: "var(--wb-builder-border)",
	background: "var(--wb-builder-panel-solid)",
	color: "var(--wb-builder-text)",
};

type LocaleRowEditorProps = {
	locale: WebsiteBuilderLocaleItem;
	index: number;
	total: number;
	onChange: (locale: WebsiteBuilderLocaleItem) => void;
	onRemove: () => void;
	onToggleDefault: () => void;
};

const LocaleRowEditor = ({
	locale,
	index,
	total,
	onChange,
	onRemove,
	onToggleDefault,
}: LocaleRowEditorProps) => {
	const { translate } = useWebsiteBuilderI18n();

	return (
		<div
			className="grid gap-3 rounded-2xl border p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_11rem_9rem_auto] md:items-end"
			style={rowStyle}
		>
			<label className="block">
				<div
					className="mb-2 text-[11px] uppercase tracking-[0.24em]"
					style={{ color: "var(--wb-builder-text-soft)" }}
				>
					{translate("settingsWebsiteBuilder.locales.code.label", "Code")}
				</div>
				<input
					value={locale.code}
					onChange={(event) =>
						onChange({
							...locale,
							code: event.currentTarget.value,
						})
					}
					className="w-full rounded-[1.1rem] border px-3 py-2.5 text-sm outline-none transition placeholder:text-[color:var(--wb-builder-text-ghost)]"
					style={inputStyle}
				/>
			</label>
			<label className="block">
				<div
					className="mb-2 text-[11px] uppercase tracking-[0.24em]"
					style={{ color: "var(--wb-builder-text-soft)" }}
				>
					{translate("settingsWebsiteBuilder.locales.label.label", "Label")}
				</div>
				<input
					value={locale.label}
					onChange={(event) =>
						onChange({
							...locale,
							label: event.currentTarget.value,
						})
					}
					className="w-full rounded-[1.1rem] border px-3 py-2.5 text-sm outline-none transition placeholder:text-[color:var(--wb-builder-text-ghost)]"
					style={inputStyle}
				/>
			</label>
			<label className="block">
				<div
					className="mb-2 text-[11px] uppercase tracking-[0.24em]"
					style={{ color: "var(--wb-builder-text-soft)" }}
				>
					{translate("settingsWebsiteBuilder.locales.status.label", "Status")}
				</div>
				<select
					value={locale.status}
					onChange={(event) => {
						const status = event.currentTarget
							.value as WebsiteBuilderLocaleStatus;
						onChange({
							...locale,
							status,
							isDefault: status === "inactive" ? false : locale.isDefault,
						});
					}}
					className="w-full rounded-[1.1rem] border px-3 py-2.5 text-sm outline-none transition"
					style={inputStyle}
				>
					{localeStatusOptions.map((option) => (
						<option key={option.value} value={option.value}>
							{translate(option.labelKey, option.label)}
						</option>
					))}
				</select>
			</label>
			<label className="block">
				<div
					className="mb-2 text-[11px] uppercase tracking-[0.24em]"
					style={{ color: "var(--wb-builder-text-soft)" }}
				>
					{translate(
						"settingsWebsiteBuilder.locales.sortOrder.label",
						"Sort order",
					)}
				</div>
				<input
					type="number"
					value={locale.sortOrder ?? index}
					onChange={(event) =>
						onChange({
							...locale,
							sortOrder: Number(event.currentTarget.value),
						})
					}
					className="w-full rounded-[1.1rem] border px-3 py-2.5 text-sm outline-none transition"
					style={inputStyle}
				/>
			</label>
			<div className="flex flex-wrap items-center gap-2">
				<button
					type="button"
					onClick={onToggleDefault}
					className="inline-flex h-10 items-center rounded-full border px-3 text-xs font-semibold uppercase tracking-[0.22em] transition"
					style={accentButtonStyle}
				>
					{locale.isDefault
						? translate(
								"settingsWebsiteBuilder.locales.default.label",
								"Default",
							)
						: translate(
								"settingsWebsiteBuilder.locales.makeDefault.label",
								"Make default",
							)}
				</button>
				<button
					type="button"
					onClick={onRemove}
					disabled={total <= 1}
					className="inline-flex h-10 items-center rounded-full border px-3 text-xs font-semibold uppercase tracking-[0.22em] transition disabled:cursor-not-allowed disabled:opacity-50"
					style={neutralButtonStyle}
				>
					{translate("settingsWebsiteBuilder.locales.remove.label", "Remove")}
				</button>
			</div>
		</div>
	);
};

const LocalesSettingsPanel: WebsiteBuilderSiteSettingsPanelDefinition["component"] =
	({ getValue, setValue }) => {
		const { translate } = useWebsiteBuilderI18n();
		const rawLocales = getValue("items");
		const locales = useMemo(
			() => normalizeWebsiteBuilderLocaleItems(rawLocales),
			[rawLocales],
		);
		const activeLocales = resolveWebsiteBuilderActiveLocales(locales);
		const editableLocales = resolveWebsiteBuilderEditableLocales(locales);
		const commit = (nextLocales: WebsiteBuilderLocaleItem[]) => {
			const normalized = nextLocales.map((locale, index) => ({
				...locale,
				sortOrder:
					typeof locale.sortOrder === "number" ? locale.sortOrder : index,
			}));
			const hasDefault = normalized.some((locale) => locale.isDefault);
			const nextValue = hasDefault
				? normalized
				: normalized.map((locale, index) =>
						index === 0
							? { ...locale, isDefault: true, status: "active" as const }
							: locale,
					);

			setValue("items", nextValue);
		};

		return (
			<div className="space-y-5">
				<div
					className="rounded-2xl border px-4 py-3 text-sm leading-6"
					style={infoCardStyle}
				>
					{translate(
						"settingsWebsiteBuilder.locales.description",
						"Active locales are public. Draft locales are editable but hidden from the frontend. Inactive locales stay parked until they are re-enabled.",
					)}
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<div
						className="rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.24em]"
						style={chipStyle}
					>
						{`${activeLocales.length} public`}
					</div>
					<div
						className="rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.24em]"
						style={chipStyle}
					>
						{`${editableLocales.length} editable`}
					</div>
					<div
						className="rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.24em]"
						style={chipStyle}
					>
						{`${locales.length} total`}
					</div>
					<button
						type="button"
						onClick={() =>
							commit([
								...locales,
								{
									code: `locale-${locales.length + 1}`,
									label: `Locale ${locales.length + 1}`,
									status: "draft",
									isDefault: false,
									sortOrder: locales.length,
								},
							])
						}
						className="inline-flex h-10 items-center rounded-full border px-3 text-xs font-semibold uppercase tracking-[0.22em] transition"
						style={accentButtonStyle}
					>
						{translate(
							"settingsWebsiteBuilder.locales.add.label",
							"Add locale",
						)}
					</button>
				</div>
				<div className="space-y-3">
					{locales.map((locale, index) => (
						<LocaleRowEditor
							key={`${locale.code}:${index}`}
							locale={locale}
							index={index}
							total={locales.length}
							onChange={(nextLocale) => {
								const nextLocales = [...locales];
								nextLocales[index] = nextLocale;

								if (nextLocale.isDefault) {
									commit(
										nextLocales.map((item, itemIndex) => ({
											...item,
											isDefault: itemIndex === index,
											status:
												itemIndex === index && item.status !== "active"
													? "active"
													: item.status,
										})),
									);
									return;
								}

								commit(nextLocales);
							}}
							onToggleDefault={() =>
								commit(
									locales.map((item, itemIndex) => ({
										...item,
										isDefault: itemIndex === index,
										status:
											itemIndex === index && item.status !== "active"
												? "active"
												: item.status,
									})),
								)
							}
							onRemove={() => {
								const nextLocales = locales.filter(
									(_, itemIndex) => itemIndex !== index,
								);
								commit(
									nextLocales.map((item, itemIndex) => ({
										...item,
										isDefault:
											itemIndex === 0
												? nextLocales.length > 0 &&
													!nextLocales.some((row) => row.isDefault)
												: item.isDefault,
									})),
								);
							}}
						/>
					))}
				</div>
			</div>
		);
	};

export const siteLocalesSettingsPanel: WebsiteBuilderSiteSettingsPanelDefinition =
	{
	key: "locales",
	label: "Locales",
	labelKey: "settingsWebsiteBuilder.locales.panel.label",
	description:
		"Global locale registry for the website builder and frontend runtime.",
	descriptionKey: "settingsWebsiteBuilder.locales.panel.description",
	order: 5,
	component: LocalesSettingsPanel,
};

export const settingsWebsiteBuilderModule: WebsiteBuilderModule = {
	module: "settings-website-builder",
	label: "Settings Website Builder",
	labelKey: "settingsWebsiteBuilder.module.label",
	version: "0.1.0",
	blocks: [],
	siteSettingsPanels: [siteLocalesSettingsPanel],
};

export const settingsWebsiteBuilderKit: WebsiteBuilderInstallableKit =
	createWebsiteBuilderKit({
		key: "settings-website-builder",
		label: "Settings Website Builder",
		modules: [settingsWebsiteBuilderModule],
	});
