import { createStore, applyMiddleware } from 'redux'
import rootReducer from '../reducers'
import thunk from 'redux-thunk';

const middleware = [thunk];
export default function configureStore(initialState) {
	const store = createStore(rootReducer, initialState, applyMiddleware(...middleware))
	return store
}