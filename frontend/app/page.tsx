"use client";

import { useState, useEffect } from "react";
import QuizQuestion from "@/components/QuizQuestion";
import QuizResults from "@/components/QuizResults";
import LoadingSpinner from "@/components/LoadingSpinner";
import { shuffleArray } from "@/lib/shuffle";

interface Question {
	id: string;
	type: "text" | "checkbox" | "radio";
	question: string;
	choices?: string[];
	choiceMapping?: number[];
}

interface Answer {
	id: string;
	value: string | number | number[];
}

interface GradeResult {
	id: string | number;
	correct: boolean;
}

interface GradeResponse {
	score: number;
	total: number;
	results: GradeResult[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const QUIZ_TIME_SECONDS = 300; // 5 minutes

export default function QuizClient() {
	const [questions, setQuestions] = useState<Question[]>([]);
	const [answers, setAnswers] = useState<Record<string, Answer["value"]>>({});
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [results, setResults] = useState<GradeResponse | null>(null);

	// Modal states
	const [showStartModal, setShowStartModal] = useState(true);
	const [showTimeUpModal, setShowTimeUpModal] = useState(false);

	// Timer state
	const [timeRemaining, setTimeRemaining] = useState(QUIZ_TIME_SECONDS);
	const [quizStarted, setQuizStarted] = useState(false);

	// Timer effect
	useEffect(() => {
		if (!quizStarted || results || loading || showTimeUpModal) return;

		const timer = setInterval(() => {
			setTimeRemaining((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					handleTimeUp();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [quizStarted, results, loading, showTimeUpModal]);

	const handleStartQuiz = async () => {
		setShowStartModal(false);
		await fetchQuiz();
	};

	const fetchQuiz = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch(`${API_URL}/api/quiz`);

			if (!response.ok) {
				throw new Error(`Failed to fetch quiz: ${response.status}`);
			}

			const data: Question[] = await response.json();

			// Shuffle questions and choices deterministically
			const seed = Date.now();
			const shuffledQuestions = shuffleArray(data, seed).map((q, idx) => {
				if (
					q.choices &&
					(q.type === "radio" || q.type === "checkbox")
				) {
					const choicesWithIndex = q.choices.map((choice, i) => ({
						choice,
						originalIndex: i,
					}));
					const shuffledChoices = shuffleArray(
						choicesWithIndex,
						seed + idx
					);

					return {
						...q,
						choices: shuffledChoices.map((c) => c.choice),
						choiceMapping: shuffledChoices.map(
							(c) => c.originalIndex
						),
					};
				}
				return q;
			});

			setQuestions(shuffledQuestions);
			setQuizStarted(true);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to load quiz"
			);
		} finally {
			setLoading(false);
		}
	};

	const handleTimeUp = () => {
		if (results || submitting || showTimeUpModal) return;
		setShowTimeUpModal(true);
	};

	const handleTimeUpConfirm = () => {
		// Auto-submit the form
		const form = document.querySelector("form");
		if (form) {
			form.dispatchEvent(
				new Event("submit", { cancelable: true, bubbles: true })
			);
		}
		setShowTimeUpModal(false);
	};

	const handleTimeUpReload = () => {
		window.location.reload();
	};

	const handleAnswerChange = (questionId: string, value: Answer["value"]) => {
		setAnswers((prev) => ({ ...prev, [questionId]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (submitting) return;

		setSubmitting(true);
		setError(null);

		try {
			const formattedAnswers = Object.entries(answers).map(
				([id, value]) => {
					const question = questions.find((q) => q.id === id);

					if (question?.choiceMapping && typeof value === "number") {
						return { id, value: question.choiceMapping[value] };
					} else if (
						question?.choiceMapping &&
						Array.isArray(value)
					) {
						return {
							id,
							value: value.map((v) => question.choiceMapping![v]),
						};
					}

					return { id, value };
				}
			);

			const response = await fetch(`${API_URL}/api/grade`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ answers: formattedAnswers }),
			});

			if (!response.ok) {
				throw new Error(`Failed to submit quiz: ${response.status}`);
			}

			const gradeData = await response.json();
			setResults(gradeData);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to submit quiz"
			);
		} finally {
			setSubmitting(false);
		}
	};

	const handleRetake = () => {
		window.location.reload();
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	// Start Modal
	if (showStartModal) {
		return (
			<div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 p-4">
				<div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 animate-fade-in">
					<div className="text-center">
						<div className="mb-6">
							<div className="text-6xl mb-4">📝</div>
							<h2 className="text-3xl font-bold text-gray-900 mb-2">
								Developer Quiz
							</h2>
							<p className="text-gray-600">
								Test your knowledge!
							</p>
						</div>

						<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
							<h3 className="font-semibold text-blue-900 mb-3">
								Quiz Information:
							</h3>
							<ul className="space-y-2 text-sm text-blue-800">
								<li className="flex items-start">
									<span className="mr-2">📊</span>
									<span>
										10 questions covering web development
									</span>
								</li>
								<li className="flex items-start">
									<span className="mr-2">⏱️</span>
									<span>5 minutes to complete</span>
								</li>
								<li className="flex items-start">
									<span className="mr-2">🔀</span>
									<span>
										Questions and answers are shuffled
									</span>
								</li>
								<li className="flex items-start">
									<span className="mr-2">⚡</span>
									<span>Auto-submits when time expires</span>
								</li>
							</ul>
						</div>

						<button
							onClick={handleStartQuiz}
							className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition transform hover:scale-105"
						>
							Start Quiz
						</button>
					</div>
				</div>
			</div>
		);
	}

	// Time's Up Modal
	if (showTimeUpModal) {
		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
				<div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 animate-fade-in">
					<div className="text-center">
						<div className="mb-6">
							<div className="text-6xl mb-4">⏰</div>
							<h2 className="text-3xl font-bold text-red-600 mb-2">
								Time's Up!
							</h2>
							<p className="text-gray-600">
								The quiz time has expired.
							</p>
						</div>

						<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
							<p className="text-red-800">
								You've answered{" "}
								<strong>{Object.keys(answers).length}</strong>{" "}
								out of <strong>{questions.length}</strong>{" "}
								questions.
							</p>
						</div>

						<div className="space-y-3">
							<button
								onClick={handleTimeUpConfirm}
								className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
							>
								Submit My Answers
							</button>
							<button
								onClick={handleTimeUpReload}
								className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition"
							>
								Start Over
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<LoadingSpinner />
			</div>
		);
	}

	if (error && !results && !submitting) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="bg-white p-8 rounded-lg shadow-md max-w-md">
					<h2 className="text-xl font-bold text-red-600 mb-4">
						Error
					</h2>
					<p className="text-gray-700 mb-4">{error}</p>
					<button
						onClick={() => window.location.reload()}
						className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
					>
						Reload Page
					</button>
				</div>
			</div>
		);
	}

	if (results) {
		return <QuizResults results={results} onRetake={handleRetake} />;
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8 px-4">
			<div className="max-w-3xl mx-auto">
				{/* Timer Display */}
				<div className="mb-6 flex justify-between items-center flex-wrap gap-4">
					<h1 className="text-4xl font-bold text-gray-900">
						Developer Quiz
					</h1>
					<div
						className={`text-2xl font-bold px-6 py-3 rounded-lg transition-colors ${
							timeRemaining < 60
								? "bg-red-100 text-red-600 animate-pulse"
								: timeRemaining < 180
								? "bg-yellow-100 text-yellow-600"
								: "bg-blue-100 text-blue-600"
						}`}
					>
						⏱️ {formatTime(timeRemaining)}
					</div>
				</div>

				{/* Warning messages */}
				{timeRemaining < 60 && !results && (
					<div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
						<p className="font-bold">
							⚠️ Less than 1 minute remaining!
						</p>
						<p className="text-sm">
							Your quiz will auto-submit when time runs out.
						</p>
					</div>
				)}

				{timeRemaining < 180 && timeRemaining >= 60 && !results && (
					<div className="mb-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 px-4 py-3 rounded">
						<p className="font-bold">
							⏰ Less than 3 minutes remaining
						</p>
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
					{questions.map((question, index) => (
						<QuizQuestion
							key={question.id}
							question={question}
							index={index}
							value={answers[question.id]}
							onChange={(value) =>
								handleAnswerChange(question.id, value)
							}
						/>
					))}

					{error && (
						<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
							{error}
						</div>
					)}

					<div className="sticky bottom-4 bg-white p-4 rounded-lg shadow-lg border-2 border-gray-200">
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm text-gray-600">
								Progress: {Object.keys(answers).length} /{" "}
								{questions.length} answered
							</span>
							<span className="text-sm font-semibold text-gray-900">
								{formatTime(timeRemaining)} remaining
							</span>
						</div>
						<button
							type="submit"
							disabled={
								submitting ||
								Object.keys(answers).length !== questions.length
							}
							className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
						>
							{submitting ? "Submitting..." : "Submit Quiz"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
