import AuthTemplate from '../components/auth/AuthTemplate';
import RegisterFormContainer from '../containers/auth/RegisterFormContainer';

const RegisterPage = () => {
	return (
		<AuthTemplate>
			<RegisterFormContainer />
		</AuthTemplate>
	);
};

export default RegisterPage;
