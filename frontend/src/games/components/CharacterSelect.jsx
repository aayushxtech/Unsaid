import React from "react";

const CharacterSelect = ({ characters, completedCharacters, onSelect, nextCharacter }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl text-center">
            <h1 className="text-3xl font-bold text-purple-800 mb-4">Select Your Character</h1>
            <div className="grid grid-cols-3 gap-4">
                {characters.map((character) => (
                    <div
                        key={character.id}
                        className={`bg-purple-50 rounded-lg p-4 ${character.id === nextCharacter
                                ? "hover:bg-purple-100 cursor-pointer"
                                : "opacity-50 cursor-not-allowed"
                            } transition-colors`}
                        onClick={() => character.id === nextCharacter && onSelect(character)}
                    >
                        <img
                            src={character.states.idle}
                            alt={character.name}
                            className="w-24 h-24 mx-auto rounded-full mb-2"
                        />
                        <h3 className="font-semibold text-purple-800">{character.name}</h3>
                        {completedCharacters.includes(character.id) && (
                            <p className="text-sm text-gray-500">Completed</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CharacterSelect;