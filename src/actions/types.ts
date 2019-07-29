export const SEND_ADDRESS = 'SEND_ADDRESS';

export interface SendAddressAction {
	type: typeof SEND_ADDRESS;
	ready: boolean;
};

export type SiteActionTypes = SendAddressAction;