"use client";

import { useState, useEffect } from "react";
import QuizQuestion from "@/components/QuizQuestion";
import QuizResults from "@/components/QuizResults";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Question {
	id: string;
	type: "text" | "checkbox" | "radio";
	question: string;
	choices?: string[];
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

export default function QuizClient() {
	const [questions, setQuestions] = useState<Question[]>([]);
	const [answers, setAnswers] = useState<Record<string, Answer["value"]>>({});
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [results, setResults] = useState<GradeResponse | null>(null);

	useEffect(() => {
		fetchQuiz();
	}, []);

	const fetchQuiz = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch(`${API_URL}/api/quiz`);

			if (!response.ok) {
				throw new Error(`Failed to fetch quiz: ${response.status}`);
			}

			const data = await response.json();
			setQuestions(data);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to load quiz"
			);
		} finally {
			setLoading(false);
		}
	};

	const handleAnswerChange = (questionId: string, value: Answer["value"]) => {
		setAnswers((prev) => ({ ...prev, [questionId]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		setSubmitting(true);
		setError(null);

		try {
			const formattedAnswers = Object.entries(answers).map(
				([id, value]) => ({
					id,
					value,
				})
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
		setAnswers({});
		setResults(null);
		setError(null);
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<LoadingSpinner />
			</div>
		);
	}

	if (error && !results) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="bg-white p-8 rounded-lg shadow-md max-w-md">
					<h2 className="text-xl font-bold text-red-600 mb-4">
						Error
					</h2>
					<p className="text-gray-700 mb-4">{error}</p>
					<button
						onClick={fetchQuiz}
						className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
					>
						Try Again
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
				<h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
					Developer Quiz
				</h1>

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
				</form>
			</div>
		</div>
	);
}
