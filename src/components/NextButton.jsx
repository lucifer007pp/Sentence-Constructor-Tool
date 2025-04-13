export default function NextButton({ disabled, onClick }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full py-2 px-4 rounded-lg font-medium ${disabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
        >
            Next Question
        </button>
    );
}