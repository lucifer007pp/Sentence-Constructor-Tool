import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function FeedbackScreen({ userAnswers, score, totalQuestions }) {

    useEffect(() => {
        const percentage = (score / totalQuestions) * 100;
        if (percentage >= 60) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }, []);

    const getStarRating = () => {
        const percentage = (score / totalQuestions) * 100;
        if (percentage === 100) return "⭐⭐⭐⭐⭐";
        if (percentage >= 80) return "⭐⭐⭐⭐";
        if (percentage >= 60) return "⭐⭐⭐";
        if (percentage >= 40) return "⭐⭐";
        return "⭐";
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold text-center text-indigo-600 mb-4">🎉 Quiz Completed!</h1>
                <div className="text-center mb-6">
                    <p className="text-xl font-semibold mb-1">
                        Your Score: <span className="text-indigo-600">{score}/{totalQuestions}</span>
                    </p>
                    <p className="text-lg text-gray-600 mb-1">
                        Percentage: <span className="text-indigo-600">{Math.round((score / totalQuestions) * 100)}%</span>
                    </p>
                    <p className="text-lg text-yellow-500">{getStarRating()}</p>
                </div>

                <div className="space-y-4 text-sm">
                    {userAnswers.map((answer, index) => (
                        <div key={index} className={`p-4 rounded-lg border ${answer.isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                            <p className="font-medium text-gray-700 mb-1">{index + 1}. {answer.question}</p>
                            <p>Your answer: <span className="font-semibold text-gray-800">{Object.values(answer.userAnswer).join(', ')}</span></p>
                            {!answer.isCorrect && (
                                <p>Correct answer: <span className="font-semibold text-green-600">{answer.correctAnswer.join(', ')}</span></p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                    >
                        🔁 Play Again
                    </button>
                </div>
            </div>
        </div>
    );
}
