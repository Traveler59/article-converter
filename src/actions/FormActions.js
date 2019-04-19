import { SEND_ADDRESS } from './types';

export const sendAddress = (address, selectors, site) => async dispatch => {
	const response = await fetch('/getArticle', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ address: address, selectors: selectors, site: site }),
	});
	const articleReady = await response.json();
	dispatch({
		type: SEND_ADDRESS,
		payload: articleReady
	});
};