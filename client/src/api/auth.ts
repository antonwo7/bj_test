import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {TUser} from "../models/user";
import {setCredentialsAction, removeCredentialsAction} from "../store/auth/authSlice"
import {setErrorAction, setSuccessAction} from "../store/common/commonSlice";
import {objectToFormData} from "../utils/request";
import {IResponse} from "../models/response";
import {AuthService} from "../services/AuthService";

type TLoginRequest = {
    username: string
    password: string
}

interface ILoginResponse extends IResponse {
    user: TUser
    token: string
}

export const authAPI = createApi({
    reducerPath: 'authAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env['REACT_APP_API_URL']}/auth`,
        prepareHeaders: (headers: Headers) => {
            const token = AuthService.getToken() || ''
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }
        }
    }),
    tagTypes: ['authUser'],
    endpoints: (builder) => ({
        login: builder.mutation<ILoginResponse, TLoginRequest>({
            query: (loginData) => {
                return {
                    url: '/login',
                    method: 'POST',
                    body: objectToFormData(loginData)
                }
            },
            async onQueryStarted(id, {dispatch, queryFulfilled}) {
                const {data} = await queryFulfilled

                if (!data.result || !data.user || !data.token) {
                    dispatch(setErrorAction(data.log || 'Error'))
                    dispatch(removeCredentialsAction())
                    return;
                }

                dispatch(setCredentialsAction({
                    authUser: data.user,
                    token: data.token
                }))
                dispatch(setSuccessAction('Success authorization!'))
            }
        }),
        validate: builder.mutation<ILoginResponse, void>({
            query: () => {
                return {
                    url: '/validate',
                    method: 'POST'
                }
            },
            async onQueryStarted(arg, {dispatch, queryFulfilled}) {
                const {data} = await queryFulfilled

                if (!data.result || !data.user) {
                    dispatch(removeCredentialsAction())
                    return;
                }

                dispatch(setCredentialsAction({
                    authUser: data.user
                }))
            }
        })
    })
})