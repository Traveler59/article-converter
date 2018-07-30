import { SEND_ADDRESS } from '../actions/types';

const initialState = {
	fileReady: null
}

const form = (state = initialState, action) => {
	switch (action.type) {
		case SEND_ADDRESS:
			return { ...state, fileReady: action.payload }

		default:
			return state;
	}
}

export default form;