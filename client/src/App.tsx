import React, {useEffect} from 'react';
import './App.css';
import TaskList from "./components/TaskList";
import Header from "./components/Header";
import {authAPI} from "./api/auth";
import {useAppDispatch, useAppSelector} from "./store/hooks";
import {resetAction} from "./store/common/commonSlice";
import FeedbackModal from "./components/modals/FeedbackModal";

function App() {
    const [validate] = authAPI.useValidateMutation()
    const common = useAppSelector(state => state.common)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (validate)
            validate()
    }, [validate])

    useEffect(() => {
        setTimeout(() => {
            if (common.error || common.success) {
                dispatch(resetAction())
            }
        }, 2000)
    }, [common.error, common.success, dispatch])

    return (
        <>
            <Header />
            <div className="bg-gray-200 w-full inline-table">
                <section className="gradient-form">
                    <div className="container-fluid px-10 mx-auto mb-1 mt-10 pb-0">
                        <div className="flex justify-center flex-wrap w-full g-6 text-gray-800 mx-auto">
                            <div className="block bg-white shadow-lg rounded-lg mb-4 w-full relative">
                                <div className="flex flex-row">
                                    <div className="flex p-4 rounded-b dark:border-gray-600 flex-col justify-center w-full">
                                        <TaskList />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            {common.success && <FeedbackModal data={common.success} />}
            {common.error && <FeedbackModal data={common.error} isError={true} />}
        </>
    )
}

export default App;
