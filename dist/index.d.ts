export { PHOTON_LOCALE_STATUSES, PhotonLocaleItem, normalizePhotonLocaleItem, normalizePhotonLocaleItems, parsePhotonLocaleCodes, resolvePhotonActiveLocales, resolvePhotonEditableLocales, resolvePhotonLocaleCodes } from './server.js';
import { PhotonInstallableKit, PhotonModule, PhotonSiteSettingsPanelDefinition } from '@init/photon/public';

declare const siteLocalesSettingsPanel: PhotonSiteSettingsPanelDefinition;
declare const settingsPhotonModule: PhotonModule;
declare const settingsPhotonKit: PhotonInstallableKit;

export { settingsPhotonKit, settingsPhotonModule, siteLocalesSettingsPanel };
