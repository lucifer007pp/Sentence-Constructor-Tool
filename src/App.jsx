import { useState, useEffect } from 'react';
import Timer from './components/Timer';
import SentenceBlanks from './components/SentenceBlanks';
import WordOptions from './components/WordOptions';
import NextButton from './components/NextButton';
import FeedbackScreen from './components/FeedbackScreen';
import './App.css';
// import 'public/questions.json'

export default function App() {
    const [testData, setTestData] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedWords, setSelectedWords] = useState({});
    const [timeLeft, setTimeLeft] = useState(30);
    const [quizFinished, setQuizFinished] = useState(false);
    const [score, setScore] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [quizStarted, setQuizStarted] = useState(false);

    // Start quiz handler
    const startQuiz = async () => {
        setLoading(true);
        try {
            const response = await fetch('/questions.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            if (data.status !== 'SUCCESS') throw new Error(data.message || 'Failed to load questions');
            if (!data.data?.questions?.length) throw new Error('No questions available');

            setTestData(data.data);
            setQuizStarted(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Timer logic
    useEffect(() => {
        if (!quizStarted || timeLeft === 0 || quizFinished || !testData) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => prev <= 1 ? 0 : prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [quizStarted, timeLeft, quizFinished, testData]);

    // Auto-next when timer ends
    useEffect(() => {
        if (timeLeft === 0 && quizStarted && testData?.questions?.length) {
            handleNextQuestion();
        }
    }, [timeLeft, quizStarted, testData]);

    // Quiz functions...
    const getBlankCount = () => (testData?.questions[currentQuestionIndex]?.question.match(/_____________/g) || []).length;

    const handleWordSelect = (word) => {
        const blankCount = getBlankCount();
        const firstEmptyBlank = Array.from({ length: blankCount }, (_, i) => i + 1)
            .find(blankId => !selectedWords[blankId]);
        if (firstEmptyBlank) setSelectedWords(prev => ({ ...prev, [firstEmptyBlank]: word }));
    };

    const handleUnselectWord = (blankId) => {
        setSelectedWords(prev => {
            const newSelectedWords = { ...prev };
            delete newSelectedWords[blankId];
            return newSelectedWords;
        });
    };

    const handleNextQuestion = () => {
        if (!testData?.questions?.length) return;

        const currentQuestion = testData.questions[currentQuestionIndex];
        const blankCount = getBlankCount();
        const isCorrect = Array.from({ length: blankCount }, (_, i) => i + 1)
            .every(blankId => selectedWords[blankId] === currentQuestion.correctAnswer[blankId - 1]);

        setUserAnswers(prev => [...prev, {
            question: currentQuestion.question,
            userAnswer: { ...selectedWords },
            correctAnswer: currentQuestion.correctAnswer,
            isCorrect
        }]);

        if (isCorrect) setScore(prev => prev + 1);

        if (currentQuestionIndex < testData.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedWords({});
            setTimeLeft(30);
        } else {
            setQuizFinished(true);
        }
    };

    // Start Page
    if (!quizStarted) {
        return (
            <StartPage
                onStart={startQuiz}
                loading={loading}
                error={error}
                onRetry={() => window.location.reload()}
            />
        );
    }

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading questions...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
                    <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Quiz finished state
    if (quizFinished) {
        return <FeedbackScreen userAnswers={userAnswers} score={score} totalQuestions={testData.questions.length} />;
    }

    // Main Quiz Page
    const currentQuestion = testData.questions[currentQuestionIndex];
    const allBlanksFilled = Object.keys(selectedWords).length === getBlankCount();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6">
                <div className="text-center mb-4">
                    <h1 className="text-2xl font-bold text-indigo-600">Sentence Construction</h1>
                </div>

                <Timer timeLeft={timeLeft} />
                <SentenceBlanks
                    sentence={currentQuestion.question}
                    blankCount={getBlankCount()}
                    selectedWords={selectedWords}
                    onUnselectWord={handleUnselectWord}
                />
                <WordOptions
                    options={currentQuestion.options}
                    selectedWords={selectedWords}
                    onWordSelect={handleWordSelect}
                />
                <NextButton
                    disabled={!allBlanksFilled}
                    onClick={handleNextQuestion}
                />
            </div>
        </div>
    );
}

// Start Page Component
function StartPage({ onStart, loading, error, onRetry }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
                <h1 className="text-3xl font-bold text-indigo-600 mb-4">Sentence Construction Challenge</h1>
                <p className="text-gray-600 mb-6">
                    Test your language skills by completing sentences with the correct words.
                    You'll have 30 seconds per question. Ready to begin?
                </p>

                {error ? (
                    <div className="mb-4 p-4 bg-red-50 rounded-lg">
                        <p className="text-red-500">{error}</p>
                        <button
                            onClick={onRetry}
                            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={onStart}
                        disabled={loading}
                        className={`px-8 py-3 text-lg font-medium rounded-lg shadow-md transition-all ${
                            loading
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-1'
                        }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Starting...
              </span>
                        ) : (
                            'Start Quiz'
                        )}
                    </button>
                )}

                <div className="mt-8 text-sm text-gray-500">
                    <p>10 questions • 30 seconds each</p>
                </div>
            </div>
        </div>
    );
}