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

export const PHOTON_LOCALE_CODE_PATTERN = /^[a-z]{2}(_[a-z]{2,4})?$/;

export const normalizePhotonLocaleCode = (code: string): string =>
	code.trim().toLowerCase().replace(/-/g, "_");

export const validatePhotonLocaleCode = (code: string): boolean =>
	PHOTON_LOCALE_CODE_PATTERN.test(code);

export const normalizePhotonLocaleItem = (
	value: Partial<PhotonLocaleItem> | null | undefined,
	fallbackCode = "ru",
	index = 0,
): PhotonLocaleItem => {
	const code =
		typeof value?.code === "string" && value.code.trim() !== ""
			? normalizePhotonLocaleCode(value.code)
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

const enforceDefaultLocaleInvariants = (
	items: PhotonLocaleDescriptor[],
	fallbackCode: string,
): PhotonLocaleDescriptor[] => {
	if (items.length === 0) {
		return [
			normalizePhotonLocaleItem({
				code: fallbackCode,
				isDefault: true,
				status: "active",
			}),
		];
	}

	const defaults = items.filter((item) => item.isDefault);
	let defaultCode: string;

	if (defaults.length === 0) {
		defaultCode = items[0].code;
	} else if (defaults.length > 1) {
		defaultCode = defaults[0].code;
	} else {
		defaultCode = defaults[0].code;
	}

	return items.map((item) => {
		const isDefault = item.code === defaultCode;
		return {
			...item,
			isDefault,
			status: isDefault ? "active" : item.status,
		};
	});
};

export const normalizePhotonLocaleItems = (
	values: unknown,
	defaultLocale = "ru",
): PhotonLocaleDescriptor[] => {
	if (typeof values === "string" && values.trim() !== "") {
		return enforceDefaultLocaleInvariants(
			[
				normalizePhotonLocaleItem({
					code: values,
					isDefault: true,
				}),
			],
			defaultLocale,
		);
	}

	if (!Array.isArray(values)) {
		return enforceDefaultLocaleInvariants(
			[
				normalizePhotonLocaleItem({
					code: defaultLocale,
					isDefault: true,
				}),
			],
			defaultLocale,
		);
	}

	const normalized = values.map((item, index) =>
		normalizePhotonLocaleItem(
			typeof item === "object" && item !== null
				? (item as Partial<PhotonLocaleItem>)
				: null,
			defaultLocale,
			index,
		),
	);

	return enforceDefaultLocaleInvariants(normalized, defaultLocale);
};

export const canDeletePhotonLocale = (
	locales: PhotonLocaleItem[],
	code: string,
): boolean => {
	const target = locales.find((locale) => locale.code === code);
	if (!target) {
		return false;
	}
	if (target.isDefault) {
		return false;
	}
	return true;
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
