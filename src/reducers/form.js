import { SEND_ADDRESS } from '../actions/types'

const initialState = {
	fileReady: false
}

export default function form(state = initialState, action) {
	switch (action.type) {
		case SEND_ADDRESS:
			return { ...state, fileReady: action.payload }

		default:
			return state;
	}
}