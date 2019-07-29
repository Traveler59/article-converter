import { createStore, applyMiddleware } from 'redux'
import { rootReducer, AppState } from '../reducers'
import thunk, { ThunkMiddleware } from 'redux-thunk';
import { SiteActionTypes } from '../actions/types';

const middleware = [thunk as ThunkMiddleware<AppState, SiteActionTypes>];

const configureStore = () => {
	const store = createStore(rootReducer, applyMiddleware(...middleware))
	return store
}

export default configureStore;