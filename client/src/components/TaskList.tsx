import React, {FC, useMemo, useState} from 'react';
import {ArrowDownIcon, ArrowUpIcon, CloseIcon, EditIcon, OptionsIcon} from "./common/icons";
import classNames from "classnames";
import {taskAPI} from "../api/task";
import SectionLoading from "./common/SectionLoading";
import TaskModal from "./modals/TaskModal";
import {useAppSelector} from "../store/hooks";
import {TTask} from "../models/task";

const addButtonClassName = "text-white hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-1.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 bg-blue-500";

const closeButton = {
    className: "text-sm focus:outline-none text-white bg-red-500 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-xl text-sm px-1 py-1 mr-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900",
    style: { width: '20px' }
}
const editButton = {
    className: "text-sm focus:outline-none text-white bg-green-500 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-xl text-sm px-1 py-1 mr-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900",
    style: { width: '20px' }
}
const th = {
    className: "border-b dark:border-slate-600 font-medium px-2 pt-3 pb-3 text-slate-800 dark:text-slate-200 text-left bg-gray-300"
}
const td = {
    className: "border-b border-slate-300 dark:border-slate-700 px-2 pt-2 pb-2 text-slate-500 dark:text-slate-400"
}

const pageClass = "flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"

const taskLimit = +(process.env['REACT_APP_LIST_LIMIT'] || 3)


type TListState = {
    page: number
    limit: number
    sort_by: string
    sort_order: 'desc' | 'asc'
}

const TaskList = () => {
    const authUser = useAppSelector(state => state.auth.authUser)
    const [openTaskModal, setOpenTaskModal] = useState<boolean>(false)
    const [shownTask, setShownTask] = useState<TTask | undefined>(undefined)
    const [sortState, setSortState] = useState<TListState>({
        page: 1,
        limit: taskLimit,
        sort_by: 'id',
        sort_order: 'desc'
    })
    const {data: taskData, isLoading: isTasksLoading} = taskAPI.useGetTasksQuery(sortState)
    const [deleteTask] = taskAPI.useDeleteTaskMutation()

    const showTaskModal = (task?: TTask) => {
        return () => {
            setShownTask(task)
            setOpenTaskModal(true)
        }
    }

    const hideTaskModal = () => {
        setOpenTaskModal(false)
    }

    const deleteTaskHandler = (id: number) => {
        return () => {
            deleteTask(id)
        }
    }

    const changeSorting = (e: React.MouseEvent<HTMLSpanElement>) => {
        if (!e.currentTarget.dataset.field) return;

        if (sortState.sort_by === e.currentTarget.dataset.field) {
            const sortOrder = sortState.sort_order === 'desc' ? 'asc' : 'desc'
            setSortState({
                ...sortState,
                sort_order: sortOrder
            })
            return;
        }

        setSortState({
            ...sortState,
            sort_order: 'desc',
            sort_by: e.currentTarget.dataset.field
        })
    }

    const changePage = (pageNumber: number) => {
        return (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault()
            setSortState({
                ...sortState,
                page: pageNumber
            })
        }
    }

    const limitText = (text: string) => text.length > 20 ? text.slice(0, 20) + '...' : text

    const pageCount = useMemo(() => {
        return taskData ? Math.ceil(taskData.count / taskLimit) : 0
    }, [taskData])

    if (isTasksLoading) {
        return <SectionLoading />
    }

    return (
        <div className="flex flex-row justify-between">
            <table className="border-collapse table-fixed w-full text-sm mt-3">
                <thead>
                    <tr>
                        <TH title="Id" field="id" clickHandler={changeSorting} sortState={sortState} />
                        <TH title="Email" field="email" clickHandler={changeSorting} sortState={sortState} />
                        <TH title="Text" field="text" />
                        <TH title="Username" field="username" clickHandler={changeSorting} sortState={sortState} />
                        <TH title="Done" field="is_done" clickHandler={changeSorting} sortState={sortState} />
                        <TH title="Edited by admin" field="is_edited" clickHandler={changeSorting} sortState={sortState} />
                        <th {...th} />
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800">
                {taskData && Array.isArray(taskData.tasks) && taskData.tasks.map(task => {
                    return (
                        <tr className={classNames('hover:bg-blue-200', {'bg-red-100': task.is_done})} key={task.id}>
                            <td className={td.className}>{task.id}</td>
                            <td className={td.className}>{task.email}</td>
                            <td className={td.className}>{limitText(task.text)}</td>
                            <td className={td.className}>{task.user_name}</td>
                            <td className={td.className}>{task.is_done ? 'Yes' : 'No'}</td>
                            <td className={td.className}>{task.is_edited ? 'Yes' : 'No'}</td>
                            <td className={td.className}>
                                {authUser ? (
                                    <>
                                        <button { ...editButton } onClick={showTaskModal(task)}>
                                            <EditIcon />
                                        </button>
                                        <button { ...closeButton } onClick={deleteTaskHandler(task.id)}>
                                            <CloseIcon />
                                        </button>
                                    </>
                                ) : (
                                    <button { ...editButton } onClick={showTaskModal(task)}>
                                        <OptionsIcon />
                                    </button>
                                )}
                            </td>
                        </tr>
                    )
                })}
                </tbody>
                <tfoot>
                    <tr>
                        <td className="py-4">
                            {pageCount > 0 && <nav>
                                <ul className="inline-flex -space-x-px text-sm">
                                    {Array.from({ length: pageCount }, (v, i) => i + 1).map((pageNumber) => (
                                        <li key={pageNumber}>
                                            {pageNumber === sortState.page ? (
                                                <span className={pageClass + ' bg-blue-400 text-white'}>
                                                    {pageNumber}
                                                </span>
                                            ) : (
                                                <a
                                                    className={pageClass}
                                                    href="#"
                                                    onClick={changePage(pageNumber)}
                                                >
                                                    {pageNumber}
                                                </a>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </nav>}
                        </td>
                    </tr>
                    <tr>
                        <td className="py-4">
                            {authUser && <button
                                className={addButtonClassName}
                                type="button"
                                onClick={showTaskModal()}
                            >
                                Add
                            </button>}
                        </td>
                    </tr>
                </tfoot>
            </table>
            {openTaskModal && <TaskModal task={shownTask} closeHandler={hideTaskModal} />}
        </div>
    )
}

type TTHProps = {
    title: string
    field: string
    clickHandler?: (e: React.MouseEvent<HTMLElement>) => void
    sortState?: TListState
}

const TH: FC<TTHProps> = ({title, field, clickHandler, sortState}) => {
    return (
        <th {...th}>
            <span
                className={classNames('flex', {'cursor-pointer': !!clickHandler})}
                data-field={field}
                onClick={clickHandler}
            >
                {title}
                {sortState && sortState.sort_by === field && (sortState.sort_order === 'desc' ? <ArrowDownIcon /> : <ArrowUpIcon />)}
            </span>
        </th>
    )
}

export default TaskList;