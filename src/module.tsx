import {
	computePhotonTranslationCompletenessForLocales,
	createPhotonKit,
	usePhotonI18n,
	usePhotonStore,
	type PhotonInstallableKit,
	type PhotonLocaleStatus,
	type PhotonModule,
	type PhotonSiteSettingsPanelDefinition,
	type PhotonTranslationCompletenessResult,
} from "@init/photon";
import { useMemo, useState } from "react";
import {
	applyPhotonBulkPublish,
	getPublishablePhotonLocales,
} from "./helpers/bulk-publish-locales";
import {
	normalizePhotonLocaleItems,
	resolvePhotonActiveLocales,
	resolvePhotonEditableLocales,
	type PhotonLocaleItem,
} from "./helpers/locales";

const localeStatusOptions: Array<{
	label: string;
	labelKey: string;
	value: PhotonLocaleStatus;
}> = [
	{
		label: "Active",
		labelKey: "settingsPhoton.locales.status.active.label",
		value: "active",
	},
	{
		label: "Draft",
		labelKey: "settingsPhoton.locales.status.draft.label",
		value: "draft",
	},
	{
		label: "Inactive",
		labelKey: "settingsPhoton.locales.status.inactive.label",
		value: "inactive",
	},
];

const infoCardStyle = {
	borderColor: "var(--photon-builder-border)",
	background:
		"linear-gradient(180deg, color-mix(in srgb, var(--photon-builder-accent) 10%, transparent), var(--photon-builder-panel-muted))",
	color: "var(--photon-builder-text)",
};

const chipStyle = {
	borderColor: "var(--photon-builder-border)",
	background: "var(--photon-builder-panel-solid)",
	color: "var(--photon-builder-text-soft)",
};

const rowStyle = {
	borderColor: "var(--photon-builder-border)",
	background: "var(--photon-builder-panel-muted)",
	color: "var(--photon-builder-text)",
};

const inputStyle = {
	borderColor: "var(--photon-builder-border)",
	background: "var(--photon-builder-field)",
	color: "var(--photon-builder-text)",
};

const accentButtonStyle = {
	borderColor: "var(--photon-builder-border-strong)",
	background: "var(--photon-builder-accent-soft)",
	color: "var(--photon-builder-accent-text)",
};

const neutralButtonStyle = {
	borderColor: "var(--photon-builder-border)",
	background: "var(--photon-builder-panel-solid)",
	color: "var(--photon-builder-text)",
};

type LocaleRowEditorProps = {
	locale: PhotonLocaleItem;
	index: number;
	total: number;
	completeness?: PhotonTranslationCompletenessResult;
	onChange: (locale: PhotonLocaleItem) => void;
	onRemove: () => void;
	onToggleDefault: () => void;
};

const LocaleRowEditor = ({
	locale,
	index,
	total,
	completeness,
	onChange,
	onRemove,
	onToggleDefault,
}: LocaleRowEditorProps) => {
	const { translate } = usePhotonI18n();
	const completenessTip = completeness
		? `${completeness.filled}/${completeness.total} translatable fields filled`
		: null;
	const completenessTone =
		completeness && completeness.total > 0
			? completeness.percentage >= 95
				? {
						color: "var(--photon-builder-success, #16a34a)",
					}
				: completeness.percentage >= 70
					? {
							color: "var(--photon-builder-warning, #d97706)",
						}
					: {
							color: "var(--photon-builder-danger, #dc2626)",
						}
			: null;

	return (
		<div
			className="grid gap-3 rounded-2xl border p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_11rem_9rem_auto] md:items-end"
			style={rowStyle}
		>
			<label className="block">
				<div className="mb-2 flex items-center justify-between gap-2">
					<span
						className="text-[11px] uppercase tracking-[0.24em]"
						style={{ color: "var(--photon-builder-text-soft)" }}
					>
						{translate("settingsPhoton.locales.code.label", "Code")}
					</span>
					{completeness && completeness.total > 0 ? (
						<span
							className="text-[10px] font-semibold tabular-nums"
							title={completenessTip ?? undefined}
							style={completenessTone ?? undefined}
						>
							{`${completeness.percentage}%`}
						</span>
					) : null}
				</div>
				<input
					value={locale.code}
					onChange={(event) =>
						onChange({
							...locale,
							code: event.currentTarget.value,
						})
					}
					className="w-full rounded-[1.1rem] border px-3 py-2.5 text-sm outline-none transition placeholder:text-[color:var(--photon-builder-text-ghost)]"
					style={inputStyle}
				/>
			</label>
			<label className="block">
				<div
					className="mb-2 text-[11px] uppercase tracking-[0.24em]"
					style={{ color: "var(--photon-builder-text-soft)" }}
				>
					{translate("settingsPhoton.locales.label.label", "Label")}
				</div>
				<input
					value={locale.label}
					onChange={(event) =>
						onChange({
							...locale,
							label: event.currentTarget.value,
						})
					}
					className="w-full rounded-[1.1rem] border px-3 py-2.5 text-sm outline-none transition placeholder:text-[color:var(--photon-builder-text-ghost)]"
					style={inputStyle}
				/>
			</label>
			<label className="block">
				<div
					className="mb-2 text-[11px] uppercase tracking-[0.24em]"
					style={{ color: "var(--photon-builder-text-soft)" }}
				>
					{translate("settingsPhoton.locales.status.label", "Status")}
				</div>
				<select
					value={locale.status}
					disabled={locale.isDefault}
					title={
						locale.isDefault
							? translate(
									"settingsPhoton.locales.defaultMustBeActive.tooltip",
									"Default locale must always be active. Promote another locale first.",
								)
							: undefined
					}
					onChange={(event) => {
						const status = event.currentTarget
							.value as PhotonLocaleStatus;
						onChange({
							...locale,
							status,
							isDefault: status === "inactive" ? false : locale.isDefault,
						});
					}}
					className="w-full rounded-[1.1rem] border px-3 py-2.5 text-sm outline-none transition disabled:cursor-not-allowed disabled:opacity-50"
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
					style={{ color: "var(--photon-builder-text-soft)" }}
				>
					{translate(
						"settingsPhoton.locales.sortOrder.label",
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
								"settingsPhoton.locales.default.label",
								"Default",
							)
						: translate(
								"settingsPhoton.locales.makeDefault.label",
								"Make default",
							)}
				</button>
				<button
					type="button"
					onClick={onRemove}
					disabled={total <= 1 || locale.isDefault}
					title={
						locale.isDefault
							? translate(
									"settingsPhoton.locales.cannotDeleteDefault.tooltip",
									"Cannot delete default locale. Promote another locale to default first.",
								)
							: undefined
					}
					className="inline-flex h-10 items-center rounded-full border px-3 text-xs font-semibold uppercase tracking-[0.22em] transition disabled:cursor-not-allowed disabled:opacity-50"
					style={neutralButtonStyle}
				>
					{translate("settingsPhoton.locales.remove.label", "Remove")}
				</button>
			</div>
		</div>
	);
};

type SettingsControlProps = {
	getValue: Parameters<PhotonSiteSettingsPanelDefinition["component"]>[0]["getValue"];
	setValue: Parameters<PhotonSiteSettingsPanelDefinition["component"]>[0]["setValue"];
};

const MissingTranslationIndicatorsControl = ({
	getValue,
	setValue,
}: SettingsControlProps) => {
	const { translate } = usePhotonI18n();
	const disabled = Boolean(getValue("disableMissingTranslationIndicators"));

	return (
		<div
			className="rounded-2xl border px-4 py-3 text-sm leading-6"
			style={infoCardStyle}
		>
			<label className="flex items-start gap-3 cursor-pointer">
				<input
					type="checkbox"
					checked={disabled}
					onChange={(event) =>
						setValue(
							"disableMissingTranslationIndicators",
							event.currentTarget.checked || null,
						)
					}
					className="mt-0.5 h-4 w-4 cursor-pointer"
				/>
				<div className="flex-1">
					<div
						className="text-[11px] font-semibold uppercase tracking-[0.24em]"
						style={{ color: "var(--photon-builder-text-soft)" }}
					>
						{translate(
							"settingsPhoton.locales.missingIndicators.label",
							"Hide missing-translation indicators",
						)}
					</div>
					<div
						className="mt-1 text-sm"
						style={{ color: "var(--photon-builder-text-soft)" }}
					>
						{translate(
							"settingsPhoton.locales.missingIndicators.description",
							"Suppresses the inline warn icon shown next to translatable fields that are empty (or copied untranslated) in any locale. Translatability metadata and the per-locale percentage in the switcher are not affected.",
						)}
					</div>
				</div>
			</label>
		</div>
	);
};

type FallbackLocaleControlProps = {
	locales: PhotonLocaleItem[];
	getValue: Parameters<PhotonSiteSettingsPanelDefinition["component"]>[0]["getValue"];
	setValue: Parameters<PhotonSiteSettingsPanelDefinition["component"]>[0]["setValue"];
};

const FallbackLocaleControl = ({
	locales,
	getValue,
	setValue,
}: FallbackLocaleControlProps) => {
	const { translate } = usePhotonI18n();
	const raw = getValue("fallbackLocale");
	const fallbackDisabled = raw === false;
	const explicitCode = typeof raw === "string" ? raw : "";
	const defaultLocale = locales.find((locale) => locale.isDefault);
	const effectiveCode = fallbackDisabled
		? null
		: explicitCode && locales.some((locale) => locale.code === explicitCode)
			? explicitCode
			: defaultLocale?.code ?? null;

	return (
		<div
			className="rounded-2xl border px-4 py-3 text-sm leading-6"
			style={infoCardStyle}
		>
			<div
				className="mb-2 text-[11px] uppercase tracking-[0.24em]"
				style={{ color: "var(--photon-builder-text-soft)" }}
			>
				{translate(
					"settingsPhoton.locales.fallback.label",
					"Field-level fallback locale",
				)}
			</div>
			<div
				className="mb-3 text-sm"
				style={{ color: "var(--photon-builder-text-soft)" }}
			>
				{translate(
					"settingsPhoton.locales.fallback.description",
					"When a field is empty in the current locale, the public site renders the value from this locale instead. Disable to leave empty fields visibly empty.",
				)}
			</div>
			<div className="flex flex-wrap items-center gap-3">
				<label className="inline-flex items-center gap-2">
					<input
						type="checkbox"
						checked={!fallbackDisabled}
						onChange={(event) => {
							if (!event.currentTarget.checked) {
								setValue("fallbackLocale", false);
							} else {
								setValue("fallbackLocale", null);
							}
						}}
						className="h-4 w-4 cursor-pointer"
					/>
					<span className="text-sm">
						{translate(
							"settingsPhoton.locales.fallback.enabled.label",
							"Enable fallback",
						)}
					</span>
				</label>
				<select
					value={explicitCode}
					disabled={fallbackDisabled}
					onChange={(event) => {
						const next = event.currentTarget.value;
						setValue("fallbackLocale", next === "" ? null : next);
					}}
					className="rounded-[1.1rem] border px-3 py-2 text-sm outline-none transition disabled:cursor-not-allowed disabled:opacity-50"
					style={inputStyle}
				>
					<option value="">
						{translate(
							"settingsPhoton.locales.fallback.useDefault.label",
							`Use default (${defaultLocale?.label ?? defaultLocale?.code ?? "—"})`,
						)}
					</option>
					{locales
						.filter((locale) => !locale.isDefault)
						.map((locale) => (
							<option key={locale.code} value={locale.code}>
								{locale.label}
							</option>
						))}
				</select>
				<span
					className="text-[10px] uppercase tracking-[0.22em]"
					style={{ color: "var(--photon-builder-text-ghost)" }}
				>
					{fallbackDisabled
						? translate(
								"settingsPhoton.locales.fallback.disabled.summary",
								"Disabled · empty fields stay empty",
							)
						: translate(
								"settingsPhoton.locales.fallback.summary",
								`Fallback target: ${effectiveCode?.toUpperCase() ?? "—"}`,
							)}
				</span>
			</div>
		</div>
	);
};

const LocalesSettingsPanel: PhotonSiteSettingsPanelDefinition["component"] =
	({ getValue, setValue }) => {
		const { translate } = usePhotonI18n();
		const rawLocales = getValue("items");
		const locales = useMemo(
			() => normalizePhotonLocaleItems(rawLocales),
			[rawLocales],
		);
		const activeLocales = resolvePhotonActiveLocales(locales);
		const editableLocales = resolvePhotonEditableLocales(locales);
		const publishableLocales = useMemo(
			() => getPublishablePhotonLocales(locales),
			[locales],
		);
		const documentBlocks = usePhotonStore((state) => state.document.blocks);
		const registry = usePhotonStore((state) => state.registry);
		const defaultLocaleCode = locales.find((l) => l.isDefault)?.code;
		const editableLocaleCodes = useMemo(
			() => editableLocales.map((l) => l.code),
			[editableLocales],
		);
		const completeness = useMemo(
			() =>
				computePhotonTranslationCompletenessForLocales({
					blocks: documentBlocks,
					registry,
					locales: editableLocaleCodes,
					...(defaultLocaleCode ? { referenceLocale: defaultLocaleCode } : {}),
				}),
			[documentBlocks, registry, editableLocaleCodes, defaultLocaleCode],
		);
		const [bulkPublishOpen, setBulkPublishOpen] = useState(false);
		const [bulkPublishSelection, setBulkPublishSelection] = useState<
			Set<string>
		>(() => new Set());
		const commit = (nextLocales: PhotonLocaleItem[]) => {
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

		const openBulkPublish = () => {
			setBulkPublishSelection(
				new Set(publishableLocales.map((locale) => locale.code)),
			);
			setBulkPublishOpen(true);
		};
		const closeBulkPublish = () => setBulkPublishOpen(false);
		const toggleBulkPublishCode = (code: string) => {
			setBulkPublishSelection((prev) => {
				const next = new Set(prev);
				if (next.has(code)) next.delete(code);
				else next.add(code);
				return next;
			});
		};
		const confirmBulkPublish = () => {
			const codes = Array.from(bulkPublishSelection);
			if (codes.length === 0) {
				closeBulkPublish();
				return;
			}
			const { nextLocales } = applyPhotonBulkPublish(locales, codes);
			commit(nextLocales);
			closeBulkPublish();
		};

		return (
			<div className="space-y-5">
				<div
					className="rounded-2xl border px-4 py-3 text-sm leading-6"
					style={infoCardStyle}
				>
					{translate(
						"settingsPhoton.locales.description",
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
							"settingsPhoton.locales.add.label",
							"Add locale",
						)}
					</button>
					<button
						type="button"
						onClick={openBulkPublish}
						disabled={publishableLocales.length === 0}
						title={
							publishableLocales.length === 0
								? translate(
										"settingsPhoton.locales.bulkPublish.empty.tooltip",
										"No draft locales to publish.",
									)
								: undefined
						}
						className="inline-flex h-10 items-center rounded-full border px-3 text-xs font-semibold uppercase tracking-[0.22em] transition disabled:cursor-not-allowed disabled:opacity-50"
						style={neutralButtonStyle}
					>
						{translate(
							"settingsPhoton.locales.bulkPublish.label",
							`Publish drafts (${publishableLocales.length})`,
						)}
					</button>
				</div>
				<FallbackLocaleControl
					locales={locales}
					getValue={getValue}
					setValue={setValue}
				/>
				<MissingTranslationIndicatorsControl
					getValue={getValue}
					setValue={setValue}
				/>
				<div className="space-y-3">
					{locales.map((locale, index) => (
						<LocaleRowEditor
							key={`${locale.code}:${index}`}
							locale={locale}
							index={index}
							total={locales.length}
							completeness={completeness[locale.code]}
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
				{bulkPublishOpen ? (
					<BulkPublishModal
						publishableLocales={publishableLocales}
						selection={bulkPublishSelection}
						onToggle={toggleBulkPublishCode}
						onCancel={closeBulkPublish}
						onConfirm={confirmBulkPublish}
					/>
				) : null}
			</div>
		);
	};

type BulkPublishModalProps = {
	publishableLocales: ReturnType<typeof getPublishablePhotonLocales>;
	selection: Set<string>;
	onToggle: (code: string) => void;
	onCancel: () => void;
	onConfirm: () => void;
};

const BulkPublishModal = ({
	publishableLocales,
	selection,
	onToggle,
	onCancel,
	onConfirm,
}: BulkPublishModalProps) => {
	const { translate } = usePhotonI18n();
	const selectedCount = selection.size;

	return (
		<div
			role="dialog"
			aria-modal="true"
			className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
			style={{ background: "color-mix(in srgb, black 50%, transparent)" }}
			onClick={(event) => {
				if (event.target === event.currentTarget) onCancel();
			}}
		>
			<div
				className="w-full max-w-md rounded-3xl border p-5 shadow-2xl"
				style={rowStyle}
			>
				<div
					className="mb-2 text-base font-semibold"
					style={{ color: "var(--photon-builder-text)" }}
				>
					{translate(
						"settingsPhoton.locales.bulkPublish.title",
						"Publish draft locales",
					)}
				</div>
				<div
					className="mb-4 text-sm leading-6"
					style={{ color: "var(--photon-builder-text-soft)" }}
				>
					{translate(
						"settingsPhoton.locales.bulkPublish.description",
						"The selected locales will be flipped from draft to active and become visible on the public site. Uncheck any you don't want to publish yet.",
					)}
				</div>
				<div className="mb-4 max-h-[40vh] space-y-2 overflow-y-auto">
					{publishableLocales.map((locale) => {
						const checked = selection.has(locale.code);
						return (
							<label
								key={locale.code}
								className="flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm transition"
								style={inputStyle}
							>
								<input
									type="checkbox"
									checked={checked}
									onChange={() => onToggle(locale.code)}
									className="h-4 w-4 cursor-pointer"
								/>
								<span className="font-medium">{locale.label}</span>
								<span
									className="ml-auto text-[10px] uppercase tracking-[0.24em]"
									style={{ color: "var(--photon-builder-text-ghost)" }}
								>
									{locale.code}
								</span>
							</label>
						);
					})}
				</div>
				<div className="flex items-center justify-end gap-2">
					<button
						type="button"
						onClick={onCancel}
						className="inline-flex h-10 items-center rounded-full border px-4 text-xs font-semibold uppercase tracking-[0.22em] transition"
						style={neutralButtonStyle}
					>
						{translate(
							"settingsPhoton.locales.bulkPublish.cancel",
							"Cancel",
						)}
					</button>
					<button
						type="button"
						onClick={onConfirm}
						disabled={selectedCount === 0}
						className="inline-flex h-10 items-center rounded-full border px-4 text-xs font-semibold uppercase tracking-[0.22em] transition disabled:cursor-not-allowed disabled:opacity-50"
						style={accentButtonStyle}
					>
						{translate(
							"settingsPhoton.locales.bulkPublish.confirm",
							`Publish ${selectedCount}`,
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export const siteLocalesSettingsPanel: PhotonSiteSettingsPanelDefinition =
	{
	key: "locales",
	label: "Locales",
	labelKey: "settingsPhoton.locales.panel.label",
	description:
		"Global locale registry for the photon and frontend runtime.",
	descriptionKey: "settingsPhoton.locales.panel.description",
	order: 5,
	component: LocalesSettingsPanel,
};

export const settingsPhotonModule: PhotonModule = {
	module: "settings-photon",
	label: "Settings Photon",
	labelKey: "settingsPhoton.module.label",
	version: "0.1.0",
	blocks: [],
	siteSettingsPanels: [siteLocalesSettingsPanel],
};

export const settingsPhotonKit: PhotonInstallableKit =
	createPhotonKit({
		key: "settings-photon",
		label: "Settings Photon",
		modules: [settingsPhotonModule],
	});
