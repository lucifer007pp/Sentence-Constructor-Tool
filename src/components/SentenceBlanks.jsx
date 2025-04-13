export default function SentenceBlanks({ sentence, blankCount, selectedWords, onUnselectWord }) {
    const parts = sentence.split('_____________');

    return (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <p className="text-lg font-medium text-gray-800 leading-relaxed">
                {parts.map((part, index) => (
                    <span key={index}>
            {part}
                        {index < blankCount && (
                            <span
                                onClick={() => onUnselectWord(index + 1)}
                                className={`inline-block mx-1 px-3 py-2 rounded-md border-2 min-w-[100px] text-center ${
                                    selectedWords[index + 1]
                                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700 cursor-pointer hover:bg-indigo-100'
                                        : 'bg-white border-gray-300 text-gray-500'
                                }`}
                            >
                {selectedWords[index + 1] || '_____________'}
              </span>
                        )}
          </span>
                ))}
            </p>
        </div>
    );
}