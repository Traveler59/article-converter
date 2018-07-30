import { SEND_ADDRESS } from '../actions/types'

const initialState = {
	link: ''
}

export default function form(state = initialState, action) {
	switch (action.type) {
		case SEND_ADDRESS:
			return { ...state, link: action.payload }

		default:
			return state;
	}
}