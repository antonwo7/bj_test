import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import {TUser} from "../../models/user";
import {AuthService} from "../../services/AuthService";

export type AuthState = {
    authUser: TUser | null
}

const initialState: AuthState = {
    authUser: null
}

type TCredentialsPayload = {
    authUser: TUser | null
    token?: string | null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentialsAction: (state, action: PayloadAction<TCredentialsPayload>) => {
            state.authUser = action.payload.authUser
            if (action.payload.token) {
                AuthService.saveToken(action.payload.token)
            }
        },
        removeCredentialsAction: (state) => {
            state.authUser = null
            AuthService.removeToken()
        },
    }
})

export const {setCredentialsAction, removeCredentialsAction} = authSlice.actions
export default authSlice.reducer