interface QuizResultsProps {
	results: {
		score: number;
		total: number;
		results: Array<{ id: string | number; correct: boolean }>;
	};
	onRetake: () => void;
}

export default function QuizResults({ results, onRetake }: QuizResultsProps) {
	const percentage = Math.round((results.score / results.total) * 100);

	const getGrade = (pct: number) => {
		if (pct >= 90)
			return { letter: "A", color: "text-green-600", bg: "bg-green-50" };
		if (pct >= 80)
			return { letter: "B", color: "text-blue-600", bg: "bg-blue-50" };
		if (pct >= 70)
			return {
				letter: "C",
				color: "text-yellow-600",
				bg: "bg-yellow-50",
			};
		if (pct >= 60)
			return {
				letter: "D",
				color: "text-orange-600",
				bg: "bg-orange-50",
			};
		return { letter: "F", color: "text-red-600", bg: "bg-red-50" };
	};

	const grade = getGrade(percentage);

	return (
		<div className="min-h-screen bg-gray-50 py-8 px-4">
			<div className="max-w-2xl mx-auto">
				<div className="bg-white rounded-lg shadow-lg overflow-hidden">
					{/* Header */}
					<div className={`${grade.bg} px-8 py-12 text-center`}>
						<h1 className="text-4xl font-bold text-gray-900 mb-4">
							Quiz Complete!
						</h1>
						<div
							className={`text-8xl font-bold ${grade.color} mb-4`}
						>
							{grade.letter}
						</div>
						<p className="text-3xl font-semibold text-gray-800">
							{results.score} / {results.total}
						</p>
						<p className="text-xl text-gray-600 mt-2">
							{percentage}% Correct
						</p>
					</div>

					{/* Detailed Results */}
					<div className="px-8 py-6">
						<h2 className="text-2xl font-bold text-gray-900 mb-4">
							Question Breakdown
						</h2>
						<div className="space-y-3">
							{results.results.map((result, idx) => (
								<div
									key={result.id}
									className={`flex items-center justify-between p-4 rounded-lg ${
										result.correct
											? "bg-green-50"
											: "bg-red-50"
									}`}
								>
									<span className="font-medium text-gray-900">
										Question {idx + 1}
									</span>
									<span
										className={`font-semibold ${
											result.correct
												? "text-green-600"
												: "text-red-600"
										}`}
									>
										{result.correct
											? "✓ Correct"
											: "✗ Incorrect"}
									</span>
								</div>
							))}
						</div>
					</div>

					{/* Actions */}
					<div className="px-8 py-6 bg-gray-50">
						<button
							onClick={onRetake}
							className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
						>
							Retake Quiz
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
