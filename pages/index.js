import styled from 'styled-components';
import Head from 'next/head';
import { useRouter } from 'next/router';

import db from '../db.json';
import Widget from '../src/components/Widget/index';
import Link from '../src/components/Link';
import Footer from '../src/components/Footer';
import GitHubCorner from '../src/components/GitHubCorner';
import QuizContainer from '../src/components/QuizContainer';
import QuizBackground from '../src/components/QuizBackground';
import QuizLogo from '../src/components/QuizLogo';
import Input from '../src/components/Input';
import Button from '../src/components/Button';

export default function Home() {
	const router = useRouter();
	const [name, setName] = React.useState('');

	return (
		<QuizBackground backgroundImage={db.bg}>
			<Head>
				<title>AluraQuizz - David</title>
			</Head>
			<QuizContainer>
				<QuizLogo />

				<Widget>
					<Widget.Header>
						<h1>Quiz Reformado</h1>
					</Widget.Header>
					<Widget.Content>
						<form
							onSubmit={function (infosDoEvento) {
								infosDoEvento.preventDefault();

								router.push(`/quiz?name=${name}`);
							}}
						>
							<Input
								name='nomeDoUsuario'
								onChange={(infosDoEvento) =>
									setName(infosDoEvento.target.value)
								}
								placeholder='Diz ai seu nome'
								value={name}
							/>
							<Button type='submit' disabled={name.length === 0}>
								{`Jogar - ${name}`}
							</Button>
						</form>
					</Widget.Content>
				</Widget>

				<Widget>
					<Widget.Content>
						<h1>Quizes da Galera</h1>

						<ul>
							{db.external.map((linkExterno) => {
								const [projectName, githubUser] = linkExterno
									.replace(/\//g, '')
									.replace('https:', '')
									.replace('.vercel.app', '')
									.split('.');

								return (
									<li key={linkExterno}>
										<Widget.Topic
											as={Link}
											href={`/quiz/${projectName}___${githubUser}`}
										>
											{`${githubUser}/${projectName}`}
										</Widget.Topic>
									</li>
								);
							})}
						</ul>
					</Widget.Content>
				</Widget>
				<Footer />
			</QuizContainer>
			<GitHubCorner projectUrl='https://github.com/davidbsoares' />
		</QuizBackground>
	);
}
