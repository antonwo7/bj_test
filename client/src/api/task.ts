import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {removeCredentialsAction} from "../store/auth/authSlice"
import {setErrorAction, setSuccessAction} from "../store/common/commonSlice";
import {objectToFormData} from "../utils/request";
import {IResponse} from "../models/response";
import {AuthService} from "../services/AuthService";
import {TTask} from "../models/task";

type TGetTasksRequest = {
    limit: number
    page: number
    sort_by: string
    sort_order: 'desc' | 'asc'
}

type TUpdateTaskRequest = TTask
type TAddTaskRequest = Omit<TTask, 'id' | 'user_name'>

interface IGetTasksResponse extends IResponse {
    tasks: TTask[]
    count: number
}

const checkTaskMutation = async (arg: any, {dispatch, queryFulfilled}: any) => {
    const {data} = await queryFulfilled
    if (data.unauthorized) {
        dispatch(removeCredentialsAction())
    }

    if (!data.result) {
        dispatch(setErrorAction(data.log || 'Error'))
    } else {
        dispatch(setSuccessAction('Successfully done!'))
    }
}

export const taskAPI = createApi({
    reducerPath: 'taskAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env['REACT_APP_API_URL']}/task`,
        prepareHeaders: (headers: Headers) => {
            const token = AuthService.getToken() || ''
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }
        }
    }),
    tagTypes: ['tasks'],
    endpoints: (builder) => ({
        getTasks: builder.query<IGetTasksResponse, TGetTasksRequest>({
            query: (data) => {
                return {
                    url: '/get_tasks',
                    method: 'GET',
                    params: data,
                }
            },
            async onQueryStarted(arg, {dispatch, queryFulfilled}) {
                let {data} = await queryFulfilled

                if (!data.result || !data.tasks) {
                    dispatch(setErrorAction(data.log || 'Error'))
                }
            },
            providesTags: ['tasks']
        }),
        addTask: builder.mutation<IResponse, TAddTaskRequest>({
            query: (data) => {
                return {
                    url: '/add_task',
                    method: 'POST',
                    body: objectToFormData(data)
                }
            },
            onQueryStarted: checkTaskMutation,
            invalidatesTags: ['tasks']
        }),
        updateTask: builder.mutation<IResponse, TUpdateTaskRequest>({
            query: (data) => {
                return {
                    url: '/update_task',
                    method: 'POST',
                    body: objectToFormData(data)
                }
            },
            onQueryStarted: checkTaskMutation,
            invalidatesTags: ['tasks']
        }),
        deleteTask: builder.mutation<IResponse, number>({
            query: (id) => {
                return {
                    url: '/delete_task',
                    method: 'POST',
                    body: objectToFormData({id})
                }
            },
            onQueryStarted: checkTaskMutation,
            invalidatesTags: ['tasks']
        })
    })
})