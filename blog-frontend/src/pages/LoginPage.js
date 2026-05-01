import AuthTemplate from '../components/auth/AuthTemplate';
import LoginFormContainer from '../containers/auth/LoginFormContainer';

const LoginPage = () => {
	return (
		<AuthTemplate>
			<LoginFormContainer />
		</AuthTemplate>
	);
};

export default LoginPage;
