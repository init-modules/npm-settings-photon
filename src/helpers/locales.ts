import type {
	PhotonLocaleDescriptor,
	PhotonLocaleStatus,
} from "@init/photon/public";

export type PhotonLocaleItem = PhotonLocaleDescriptor;

export const PHOTON_LOCALE_STATUSES: PhotonLocaleStatus[] = [
	"active",
	"draft",
	"inactive",
];

export const normalizePhotonLocaleItem = (
	value: Partial<PhotonLocaleItem> | null | undefined,
	fallbackCode = "ru",
	index = 0,
): PhotonLocaleItem => {
	const code =
		typeof value?.code === "string" && value.code.trim() !== ""
			? value.code.trim().toLowerCase()
			: fallbackCode;
	const label =
		typeof value?.label === "string" && value.label.trim() !== ""
			? value.label.trim()
			: code.toUpperCase();
	const status = PHOTON_LOCALE_STATUSES.includes(
		value?.status as PhotonLocaleStatus,
	)
		? (value?.status as PhotonLocaleStatus)
		: "active";

	return {
		code,
		label,
		status,
		isDefault: Boolean(value?.isDefault),
		sortOrder:
			typeof value?.sortOrder === "number" && Number.isFinite(value.sortOrder)
				? value.sortOrder
				: index,
	};
};

export const normalizePhotonLocaleItems = (
	values: unknown,
	defaultLocale = "ru",
): PhotonLocaleDescriptor[] => {
	if (!Array.isArray(values)) {
		return [
			normalizePhotonLocaleItem({
				code: defaultLocale,
				isDefault: true,
			}),
		];
	}

	return values.map((item, index) =>
		normalizePhotonLocaleItem(
			typeof item === "object" && item !== null
				? (item as Partial<PhotonLocaleItem>)
				: null,
			defaultLocale,
			index,
		),
	);
};

export const parsePhotonLocaleCodes = (
	value: string | undefined,
	_fallback: string[] = ["ru", "en"],
): string[] =>
	(value ?? "")
		.split(",")
		.map((item) => item.trim().toLowerCase())
		.filter(Boolean);

export const resolvePhotonLocaleCodes = (
	value: string | undefined,
	fallback: string[] = ["ru", "en"],
): string[] => {
	const parsed = parsePhotonLocaleCodes(value, fallback);

	return parsed.length > 0 ? parsed : fallback;
};

const bySortOrder = (
	left: PhotonLocaleItem,
	right: PhotonLocaleItem,
): number => (left.sortOrder ?? 0) - (right.sortOrder ?? 0);

export const resolvePhotonActiveLocales = (
	locales: PhotonLocaleItem[],
): PhotonLocaleDescriptor[] =>
	locales.filter((locale) => locale.status === "active").sort(bySortOrder);

export const resolvePhotonEditableLocales = (
	locales: PhotonLocaleItem[],
): PhotonLocaleDescriptor[] =>
	locales
		.filter((locale) => locale.status === "active" || locale.status === "draft")
		.sort(bySortOrder);
