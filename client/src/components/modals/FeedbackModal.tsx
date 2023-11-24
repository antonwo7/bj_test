import React, {FC} from 'react';
import classNames from "classnames";

type TFeedbackModalProps = {
    data: string | string[]
    isError?: boolean
}

const FeedbackModal: FC<TFeedbackModalProps> = ({data, isError}) => {
    return (
        <div className={classNames('fixed bottom-0 right-0 w-[400px] p-6 border rounded z-[100]', {
            'bg-red-300': isError,
            'bg-green-300': !isError
        })}>
            {Array.isArray(data)
                ? data.map(str => <div className="text-black text-lg">{str}</div>)
                : <div className="text-black text-lg">{data}</div>
            }
        </div>
    )
}

export default FeedbackModal;