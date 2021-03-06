import React from 'react';
import { Lottie } from '@crello/react-lottie';
// import db from '../../../db.json';
import Widget from '../../../src/components/Widget/index';
import QuizLogo from '../../../src/components/QuizLogo';
import QuizBackground from '../../../src/components/QuizBackground';
import QuizContainer from '../../../src/components/QuizContainer';
import AlternativesForm from '../../../src/components/AlternativesForm';
import Button from '../../../src/components/Button';
import loadingAnimation from '../../../src/screens/Quiz/animations/loading.json';
import BackLinkArrow from '../../components/BackLinkArrow';

function ResultWidget({ results }) {
	return (
		<Widget>
			<Widget.Header>Carregando...</Widget.Header>

			<Widget.Content>
				<p>
					Você acertou{' '}
					{results.reduce((somatoriaAtual, resultAtual) => {
						const isRight = resultAtual === true;
						if (isRight) {
							return somatoriaAtual + 1;
						}
						return somatoriaAtual;
					}, 0)}{' '}
					perguntas
				</p>
				<ul>
					{results.map((result, index) => (
						<li key={`result__${result}`}>
							#0
							{index + 1} Resultado: {''}
							{result === true ? 'Acertou' : 'Errou'}
						</li>
					))}
				</ul>
			</Widget.Content>
		</Widget>
	);
}

function LoadingWidget() {
	return (
		<Widget>
			<Widget.Header>Carregando...</Widget.Header>

			<Widget.Content style={{ display: 'flex', justifyContent: 'center' }}>
				<Lottie
					width='200px'
					height='200px'
					className='lottie-container basic'
					config={{
						animationData: loadingAnimation,
						loop: true,
						autoplay: true,
					}}
				/>
			</Widget.Content>
		</Widget>
	);
}
function QuestionWidget({
	question,
	totalQuestions,
	questionIndex,
	onSubmit,
	addResult,
}) {
	const [selectedAlternative, setSelectedAlternative] = React.useState(
		undefined
	);
	const [isQuestionSubmitted, setIsQuestionSubmitted] = React.useState(false);
	const questionId = `question__${questionIndex}`;
	const isCorrect = selectedAlternative === question.answer;
	const hasAlternativeSelected = selectedAlternative !== undefined;
	return (
		<Widget>
			<Widget.Header>
				<BackLinkArrow href='/' />
				<h3>
					{`Pergunta
					${questionIndex + 1}
					de
					${totalQuestions}`}
				</h3>
			</Widget.Header>

			<img
				alt='Descrição'
				style={{
					width: '100%',
					height: '150px',
					objectFit: 'cover',
				}}
				src={question.image}
			/>
			<Widget.Content>
				<h2>{question.title}</h2>

				<p>{question.description}</p>

				<AlternativesForm
					onSubmit={(infosDoEvento) => {
						infosDoEvento.preventDefault();
						setIsQuestionSubmitted(true);
						setTimeout(() => {
							addResult(isCorrect);
							onSubmit();
							setIsQuestionSubmitted(false);
							setSelectedAlternative(undefined);
						}, 2 * 1000);
					}}
				>
					{question.alternatives.map((alternative, alternativeIndex) => {
						const alternativeId = `alternative__${alternativeIndex}`;
						const AlternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';
						const isSelected = selectedAlternative === alternativeIndex;
						return (
							<Widget.Topic
								as='label'
								key={alternativeId}
								htmlFor={alternativeId}
								data-selected={isSelected}
								data-status={isQuestionSubmitted && AlternativeStatus}
							>
								<input
									style={{ display: 'none' }}
									id={alternativeId}
									name={questionId}
									onChange={() => setSelectedAlternative(alternativeIndex)}
									type='radio'
								/>
								{alternative}
							</Widget.Topic>
						);
					})}
					{/* {JSON.stringify(question.alternatives)} */}
					<Button type='submit' disabled={!hasAlternativeSelected}>
						Confirmar
					</Button>
					{isQuestionSubmitted && isCorrect && <p>Você acertou!</p>}
					{isQuestionSubmitted && !isCorrect && <p>Você errou!</p>}
				</AlternativesForm>
			</Widget.Content>
		</Widget>
	);
}

const screenStates = {
	QUIZ: 'QUIZ',
	LOADING: 'LOADING',
	RESULT: 'RESULT',
};
export default function QuizPage({ externalQuestions, externalBg }) {
	const [screenState, setScreenState] = React.useState(screenStates.LOADING);
	const [results, setResults] = React.useState([]);
	const totalQuestions = externalQuestions.length;
	const [currentQuestion, setCurrentQuestion] = React.useState(0);
	const questionIndex = currentQuestion;
	const question = externalQuestions[questionIndex];
	const bg = externalBg;

	function addResult(result) {
		setResults([...results, result]);
	}

	// atualiza === willUpdate
	// morre === willUnmount
	React.useEffect(() => {
		setTimeout(() => {
			setScreenState(screenStates.QUIZ);
		}, 1 * 1000);
		// nasce === didMount
	}, []);

	function handleSubmitQuiz() {
		const nextQuestion = questionIndex + 1;
		if (nextQuestion < totalQuestions) {
			setCurrentQuestion(nextQuestion);
		} else {
			setScreenState(screenStates.RESULT);
		}
	}

	return (
		<QuizBackground backgroundImage={bg}>
			<QuizContainer>
				<QuizLogo />

				{screenState === screenStates.QUIZ && (
					<QuestionWidget
						question={question}
						questionIndex={questionIndex}
						totalQuestions={totalQuestions}
						onSubmit={handleSubmitQuiz}
						addResult={addResult}
					/>
				)}
				{screenState === screenStates.LOADING && <LoadingWidget />}
				{screenState === screenStates.RESULT && (
					<ResultWidget results={results} />
				)}
			</QuizContainer>
		</QuizBackground>
	);
}
