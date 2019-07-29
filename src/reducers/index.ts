import { combineReducers } from 'redux'
import form from './form'

export const rootReducer = combineReducers({ form });

export type AppState = ReturnType<typeof rootReducer>;