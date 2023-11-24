import React, {FC, useEffect, useState} from 'react';
import {CloseIcon} from "../common/icons";
import {authAPI} from "../../api/auth";
import {useAppSelector} from "../../store/hooks";

type TLoginModalProps = {
    closeHandler: () => void
}

const inputClassName = "block w-full flex-1 rounded-none rounded-r-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3"
const labelClassName = "inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500"
const buttonClassName = "text-white bg-blue-700 hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-1.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
const closeButton = {
    className: "absolute w-[20px] h-[20px] top-1 right-1 text-sm focus:outline-none text-white bg-red-500 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-xl text-sm px-1 py-1 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900",
}

type TLoginData = {
    username: string
    password: string
}

const LoginModal: FC<TLoginModalProps> = ({closeHandler}) => {
    const authUser = useAppSelector(state => state.auth.authUser)
    const [loginData, setLoginData] = useState<TLoginData>({
        username: '',
        password: ''
    })

    const [login, {isLoading}] = authAPI.useLoginMutation()

    const changeFieldHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (!e.target.name || !(e.target.name in loginData)) return;
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        })
    }

    const saveHandler = async () => {
        login(loginData)
    }

    useEffect(() => {
        if (authUser) {
            closeHandler()
        }
    }, [authUser, closeHandler])

    return (
        <div className="flex items-center justify-center bg-white fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div className="relative w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <button type="button" onClick={closeHandler} {...closeButton} >
                        <CloseIcon />
                    </button>
                    <div className="px-6 py-8 lg:px-8">
                        <form className="space-y-6" action="#">
                            <div className="mb-4 flex">
                                <div className="flex rounded-md shadow-sm w-full">
                                    <label className={labelClassName}>Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        className={inputClassName}
                                        value={loginData.username}
                                        onChange={changeFieldHandler}
                                    />
                                </div>
                            </div>
                            <div className="mb-4 flex">
                                <div className="flex rounded-md shadow-sm w-full">
                                    <label className={labelClassName}>Username</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className={inputClassName}
                                        value={loginData.password}
                                        onChange={changeFieldHandler}
                                    />
                                </div>
                            </div>

                            <div className="">
                                <button
                                    className={buttonClassName}
                                    type="button"
                                    onClick={saveHandler}
                                    disabled={isLoading}
                                >
                                    Enter
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginModal;