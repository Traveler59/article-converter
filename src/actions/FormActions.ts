import { SEND_ADDRESS, SiteActionTypes } from './types';
import { Dispatch } from 'redux';

export const sendAddress = (address: string, selectors: string[], siteName: string) => async (dispatch: Dispatch<SiteActionTypes>) => {
	const response = await fetch('/getArticle', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ address: address, selectors: selectors, site: siteName }),
	});
	const articleReady = await response.json();
	dispatch({
		type: SEND_ADDRESS,
		ready: articleReady
	});
};
