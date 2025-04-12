import React from "react";

const GameStory = ({ character, act, onProgress, onActChange }) => {
    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold text-purple-800 mb-4">
                {character.name}'s Story - Act {act}
            </h2>
            <p className="text-gray-700">
                This is where the story content for {character.name} will go.
            </p>
            <button
                onClick={() => onProgress(50)}
                className="mt-4 bg-purple-600 text-white py-2 px-4 rounded-full hover:bg-purple-700"
            >
                Continue
            </button>
        </div>
    );
};

export default GameStory;