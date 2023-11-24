import React from "react";
import {PageLoadingIcon} from "./icons";

const SectionLoading = () => {
    return (
        <div className="fixed w-full h-full block top-0 left-0 bg-white z-50 bg-opacity-100 flex align-middle">
            <span className="text-green-500 opacity-75 my-0 mx-auto block relative flex justify-center items-center">
                <PageLoadingIcon />
            </span>
        </div>
    )
}

export default SectionLoading