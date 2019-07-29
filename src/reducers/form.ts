import { SEND_ADDRESS, SiteActionTypes } from '../actions/types';

const form = (state = { fileReady: null }, action: SiteActionTypes) => {
	switch (action.type) {
		case SEND_ADDRESS:
			return { ...state, fileReady: action.ready }

		default:
			return state;
	}
}

export default form;