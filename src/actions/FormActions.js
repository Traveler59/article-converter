import { SEND_ADDRESS } from './types';

export const sendAddress = (address, selectors) => dispatch => {
	fetch('/getArticle', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ address: address, selectors: selectors, site: 'sep' }),
	})
		.then(res => res.json())
		.then(fileReady =>
			dispatch({
				type: SEND_ADDRESS,
				payload: fileReady
			})
		);
};