import { useEffect, useRef } from "react";
import tickSound from "../assets/tick.mp3"; // adjust the path as needed

export default function Timer({ timeLeft }) {
    const audioRef = useRef(null);

    useEffect(() => {
        if (timeLeft <= 5 && timeLeft > 0 && audioRef.current)
        {
            audioRef.current.play().catch((err) => {
                console.warn("Audio play failed:", err);
            });
        }
    }, [timeLeft]);

    const getBarColor = (timeLeft) => {
        if (timeLeft > 20) return "bg-green-500";
        if (timeLeft > 10) return "bg-yellow-500";
        return "bg-red-500";
    };

    return (
        <div className="mb-4">
            <audio ref={audioRef} src={tickSound} preload="auto" />
            <div className="h-2 bg-gray-200 rounded-full">
                <div
                    className={`h-2 rounded-full transition-all duration-1000 ${getBarColor(timeLeft)}`}
                    style={{ width: `${(timeLeft / 30) * 100}%` }}
                ></div>
            </div>
            <p className="text-right text-sm font-medium text-gray-600 mt-1">
                Time left: <span className="text-indigo-600">{timeLeft}s</span>
            </p>
        </div>
    );
}
