import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeField, initializeForm } from '../../modules/auth';
import AuthForm from '../../components/auth/AuthForm';
import { useLoginMutation } from '../../lib/api/auth';
import { useNavigate } from 'react-router-dom';
import logger from '../../lib/logger';

const LoginForm = () => {
	const [error, setError] = useState(null);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const form = useSelector((state) => state.auth.login);
	const [login, { error: loginError }] = useLoginMutation();

	// 입력값 변경
	const onChange = (e) => {
		const { value, name } = e.target;
		dispatch(
			changeField({
				form: 'login',
				key: name,
				value,
			}),
		);
	};

	// 로그인 요청
	const onSubmit = async (e) => {
		e.preventDefault();
		const { username, password } = form;

		// 하나라도 빈 칸이 있을 때
		if ([username, password].includes('')) {
			setError('아이디/비밀번호를 입력하세요.');
			return;
		}

		try {
			// 로그인 API 호출
			await login({ username, password }).unwrap();
			navigate('/');
		} catch (e) {
			logger.log(e);
		}
	};

	// 입력 폼 초기화
	useEffect(() => {
		dispatch(initializeForm('login'));
	}, [dispatch]);

	// 로그인 실패 처리
	useEffect(() => {
		if (loginError) {
			if (loginError.status === 400 || loginError.status === 401) {
				setError('아이디 또는 비밀번호가 올바르지 않습니다.');
			} else {
				setError('로그인 실패');
			}
		}
	}, [loginError]);

	return (
		<AuthForm
			type="login"
			form={form}
			onChange={onChange}
			onSubmit={onSubmit}
			error={error}
		/>
	);
};

export default LoginForm;
