import React, {FC, useEffect, useState} from 'react';
import {taskAPI} from "../../api/task";
import {TTask} from "../../models/task";
import {CloseIcon} from "../common/icons";
import {userAPI} from "../../api/user";
import {useAppSelector} from "../../store/hooks";

const inputClassName = "block w-full flex-1 py-2 rounded-none rounded-r-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3"
const labelClassName = "inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500"
const selectClassName = "text-black block w-full flex-1 rounded-none rounded-r-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3"
const buttonClassName = "text-white bg-blue-700 hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-1.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
const closeButton = {
    className: "absolute w-[20px] h-[20px] top-1 right-1 text-sm focus:outline-none text-white bg-red-500 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-xl text-sm px-1 py-1 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900",
}

type TTaskModalProps = {
    task?: TTask | null
    closeHandler: () => void
}

type TChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>

const taskDefault: TTask = {
    id: 0,
    email: '',
    text: '',
    user_id: 0,
    is_done: 0,
    is_edited: 0
}

const TaskModal: FC<TTaskModalProps> = ({task, closeHandler}) => {
    const authUser = useAppSelector(state => state.auth.authUser)
    const {data: usersData} = userAPI.useGetUsersQuery()
    const [addTask, {data: addData}] = taskAPI.useAddTaskMutation()
    const [updateTask, {data: updateData}] = taskAPI.useUpdateTaskMutation()
    const [taskData, setTaskData] = useState<TTask>(task || taskDefault)

    const changeFieldHandler = (isEdited?: boolean) => {
        return (e: TChangeEvent) => {
            if (!e.currentTarget.name || !(e.currentTarget.name in taskData)) return;

            if (e.currentTarget.type && e.currentTarget.type === 'checkbox') {
                const currentValue = taskData[e.currentTarget.name as keyof TTask]
                setTaskData({
                    ...taskData,
                    [e.currentTarget.name]: currentValue === 0 ? 1 : 0
                })
                return;
            }

            setTaskData({
                ...taskData,
                [e.currentTarget.name]: e.currentTarget.value,
                is_edited: isEdited ? 1 : taskData.is_edited
            })
        }
    }

    const saveHandler = async () => {
        if (!task) {
            await addTask(taskData)
        } else {
            await updateTask(taskData)
        }
    }

    useEffect(() => {
        if ((addData && addData.result) || (updateData && updateData.result)) {
            closeHandler()
        }
    }, [addData, updateData, closeHandler])

    return (
        <div className="flex items-center justify-center bg-white fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div className="relative w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <button type="button" onClick={closeHandler} {...closeButton} >
                        <CloseIcon />
                    </button>
                    <div className="px-6 py-6 lg:px-8">
                        <form className="space-y-6" action="#">
                            <div className="mb-4 flex">
                                <div className="flex rounded-md shadow-sm w-full">
                                    <label className={labelClassName}>Email</label>
                                    <input
                                        type="text"
                                        name="email"
                                        className={inputClassName}
                                        value={taskData.email}
                                        onChange={changeFieldHandler()}
                                        disabled={!authUser}
                                    />
                                </div>
                            </div>
                            <div className="mb-4 flex">
                                <div className="flex rounded-md shadow-sm w-full">
                                    <label className={labelClassName}>Text</label>
                                    <textarea
                                        name="text"
                                        className={inputClassName}
                                        value={taskData.text}
                                        onChange={changeFieldHandler(true)}
                                        disabled={!authUser}
                                    />
                                </div>
                            </div>
                            <div className="mb-4 flex">
                                <div className="flex rounded-md shadow-sm w-full">
                                    <label className={labelClassName}>User</label>
                                    <select
                                        className={selectClassName}
                                        name="user_id"
                                        onChange={changeFieldHandler()}
                                        value={taskData.user_id}
                                        disabled={!authUser}
                                    >
                                        <option value="" />
                                        {usersData && Array.isArray(usersData.users) && usersData.users.map(user =>
                                            <option key={user.id} value={user.id}>{user.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            {task && <div className="mb-4 flex">
                                <div className="flex rounded-md shadow-sm w-full">
                                    <label className="mr-2">Is done?</label>
                                    <input
                                        type="checkbox"
                                        name="is_done"
                                        checked={!!taskData.is_done}
                                        onChange={changeFieldHandler()}
                                        disabled={!authUser}
                                    />
                                </div>
                            </div>}

                            {authUser && <div className="">
                                <button
                                    className={buttonClassName}
                                    type="button"
                                    onClick={saveHandler}
                                >
                                    Save
                                </button>
                            </div>}

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskModal;