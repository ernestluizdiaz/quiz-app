interface QuizQuestionProps {
	question: {
		id: string;
		type: "text" | "checkbox" | "radio";
		question: string;
		choices?: string[];
	};
	index: number;
	value: string | number | number[] | undefined;
	onChange: (value: string | number | number[]) => void;
}

export default function QuizQuestion({
	question,
	index,
	value,
	onChange,
}: QuizQuestionProps) {
	const handleCheckboxChange = (choiceIndex: number) => {
		const currentValue = Array.isArray(value) ? value : [];
		const newValue = currentValue.includes(choiceIndex)
			? currentValue.filter((i) => i !== choiceIndex)
			: [...currentValue, choiceIndex];
		onChange(newValue);
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<h3 className="text-lg font-semibold text-gray-900 mb-4">
				{index + 1}. {question.question}
			</h3>

			{question.type === "text" && (
				<input
					type="text"
					value={typeof value === "string" ? value : ""}
					onChange={(e) => onChange(e.target.value)}
					className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					placeholder="Type your answer..."
				/>
			)}

			{question.type === "radio" && question.choices && (
				<div className="space-y-3">
					{question.choices.map((choice, idx) => (
						<label
							key={idx}
							className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition"
						>
							<input
								type="radio"
								name={question.id}
								value={idx}
								checked={value === idx}
								onChange={() => onChange(idx)}
								className="w-4 h-4 text-blue-600 focus:ring-blue-500"
							/>
							<span className="text-gray-700">{choice}</span>
						</label>
					))}
				</div>
			)}

			{question.type === "checkbox" && question.choices && (
				<div className="space-y-3">
					{question.choices.map((choice, idx) => (
						<label
							key={idx}
							className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition"
						>
							<input
								type="checkbox"
								checked={
									Array.isArray(value) && value.includes(idx)
								}
								onChange={() => handleCheckboxChange(idx)}
								className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
							/>
							<span className="text-gray-700">{choice}</span>
						</label>
					))}
				</div>
			)}
		</div>
	);
}
