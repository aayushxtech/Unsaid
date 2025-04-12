import React from "react";

const ProgressBar = ({ progress }) => {
    return (
        <div className="w-full bg-purple-100 rounded-full h-2">
            <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

export default ProgressBar;