import React, {useState} from 'react';
import {LoginIcon, LogoutIcon} from "./common/icons";
import LoginModal from "./modals/LoginModal";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {removeCredentialsAction} from "../store/auth/authSlice";

const Header = () => {
    const dispatch = useAppDispatch()
    const authUser = useAppSelector(state => state.auth.authUser)
    const [openLoginModal, setOpenLoginModal] = useState<boolean>(false)

    const hideLoginModalHandler = () => {
        setOpenLoginModal(false)
    }

    const showLoginModalHandler = () => {
        setOpenLoginModal(true)
    }

    const logoutHandler = () => {
        dispatch(removeCredentialsAction())
    }

    return (
        <>
            <nav className="relative w-full flex flex-wrap items-center justify-between py-4 bg-gray-100 text-gray-500 hover:text-gray-700 focus:text-gray-700 shadow-lg navbar navbar-expand-lg navbar-light">
                <div className="container-fluid w-full flex flex-wrap items-center justify-between px-6 relative">
                    <div className="flex items-center absolute right-0 px-2.5 py-2">
                        <div className="text-gray-800 mr-4">
                            {authUser ? (
                                <div className="flex">
                                    <span className="mr-4">{`Hello, ${authUser.name}`}</span>
                                    <div className="cursor-pointer" onClick={logoutHandler}>
                                        <LogoutIcon />
                                    </div>
                                </div>
                            ) : (
                                <div className="cursor-pointer" onClick={showLoginModalHandler}>
                                    <LoginIcon />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            {openLoginModal && <LoginModal closeHandler={hideLoginModalHandler} />}
        </>
    )
}

export default Header;