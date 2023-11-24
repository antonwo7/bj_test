import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {setErrorAction} from "../store/common/commonSlice";
import {IResponse} from "../models/response";
import {AuthService} from "../services/AuthService";
import {TUser} from "../models/user";

interface IGetUsersResponse extends IResponse {
    users: TUser[]
}

export const userAPI = createApi({
    reducerPath: 'userAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env['REACT_APP_API_URL']}/user`,
        prepareHeaders: (headers: Headers) => {
            const token = AuthService.getToken() || ''
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }
        }
    }),
    endpoints: (builder) => ({
        getUsers: builder.query<IGetUsersResponse, void>({
            query: () => {
                return {
                    url: '/get_users',
                    method: 'GET'
                }
            },
            async onQueryStarted(arg, {dispatch, queryFulfilled}) {
                const {data} = await queryFulfilled

                if (!data.result || !data.users) {
                    dispatch(setErrorAction(data.log || 'Error'))
                }
            },
        })
    })
})