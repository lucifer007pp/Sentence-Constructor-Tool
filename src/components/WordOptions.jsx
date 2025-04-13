export default function WordOptions({ options, selectedWords, onWordSelect }) {
    const isWordUsed = (word) => Object.values(selectedWords).includes(word);

    return (
        <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">SELECT WORDS TO FILL BLANKS:</h3>
            <div className="flex flex-wrap gap-2">
                {options.map((word) => (
                    <button
                        key={word}
                        onClick={() => !isWordUsed(word) && onWordSelect(word)}
                        disabled={isWordUsed(word)}
                        className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${
                            isWordUsed(word)
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                        }
              min-w-[100px]
            `}
                    >
                        {word}
                    </button>
                ))}
            </div>
        </div>
    );
}