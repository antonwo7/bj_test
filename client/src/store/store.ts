import {configureStore} from "@reduxjs/toolkit"
import authReducer from "./auth/authSlice";
import commonReducer from "./common/commonSlice";
import {authAPI} from "../api/auth";
import {setupListeners} from "@reduxjs/toolkit/query";
import {userAPI} from "../api/user";
import {taskAPI} from "../api/task";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        common: commonReducer,
        [authAPI.reducerPath]: authAPI.reducer,
        [taskAPI.reducerPath]: taskAPI.reducer,
        [userAPI.reducerPath]: userAPI.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
        authAPI.middleware,
        userAPI.middleware,
        taskAPI.middleware,
    )
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

setupListeners(store.dispatch)