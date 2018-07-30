import { SEND_ADDRESS } from './types';

export const sendAddress = (address, selectors) => dispatch => {
	fetch('/getArticle', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ address: `https://plato.stanford.edu/entries/${address}/`, selectors: selectors, site: 'sep' }),
	})
		.then(res => res.json())
		.then(link =>
			dispatch({
				type: SEND_ADDRESS,
				payload: link
			})
		);
};