import { PhotonLocaleStatus, PhotonLocaleDescriptor } from '@init/photon/public';

type PhotonLocaleItem = PhotonLocaleDescriptor;
declare const PHOTON_LOCALE_STATUSES: PhotonLocaleStatus[];
declare const normalizePhotonLocaleItem: (value: Partial<PhotonLocaleItem> | null | undefined, fallbackCode?: string, index?: number) => PhotonLocaleItem;
declare const normalizePhotonLocaleItems: (values: unknown, defaultLocale?: string) => PhotonLocaleDescriptor[];
declare const parsePhotonLocaleCodes: (value: string | undefined, _fallback?: string[]) => string[];
declare const resolvePhotonLocaleCodes: (value: string | undefined, fallback?: string[]) => string[];
declare const resolvePhotonActiveLocales: (locales: PhotonLocaleItem[]) => PhotonLocaleDescriptor[];
declare const resolvePhotonEditableLocales: (locales: PhotonLocaleItem[]) => PhotonLocaleDescriptor[];

export { PHOTON_LOCALE_STATUSES, type PhotonLocaleItem, normalizePhotonLocaleItem, normalizePhotonLocaleItems, parsePhotonLocaleCodes, resolvePhotonActiveLocales, resolvePhotonEditableLocales, resolvePhotonLocaleCodes };
