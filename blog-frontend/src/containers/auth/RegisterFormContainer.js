import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeField, initializeForm } from '../../modules/auth';
import AuthForm from '../../components/auth/AuthForm';
import { useRegisterMutation } from '../../lib/api/auth';
import { useNavigate } from 'react-router-dom';
import logger from '../../lib/logger';

const RegisterForm = () => {
	const [error, setError] = useState(null);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const form = useSelector((state) => state.auth.register);
	const [register, { error: registerError }] = useRegisterMutation();

	// 입력값 변경
	const onChange = (e) => {
		const { value, name } = e.target;
		dispatch(
			changeField({
				form: 'register',
				key: name,
				value,
			}),
		);
	};

	// 회원가입 요청
	const onSubmit = async (e) => {
		e.preventDefault();
		const { username, password, passwordConfirm } = form;

		// 하나라도 빈 칸이 있을 때
		if ([username, password, passwordConfirm].includes('')) {
			setError('빈 칸을 모두 입력하세요.');
			return;
		}

		// 비밀번호가 일치하지 않을 때
		if (password !== passwordConfirm) {
			setError('비밀번호가 일치하지 않습니다.');
			return;
		}

		try {
			// 회원가입 API 호출
			await register({ username, password }).unwrap();
			navigate('/');
		} catch (e) {
			logger.log(e);
		}
	};

	// 입력 폼 초기화
	useEffect(() => {
		dispatch(initializeForm('register'));
	}, [dispatch]);

	// 회원가입 실패 처리
	useEffect(() => {
		if (registerError) {
			if (registerError.status === 409) {
				setError('이미 존재하는 아이디입니다.');
			} else if (registerError.status === 400) {
				setError('아이디는 3자 이상 20자 이하의 영문/숫자 조합이어야 합니다.');
			} else {
				setError('회원가입 실패');
			}
		}
	}, [registerError]);

	return (
		<AuthForm
			type="register"
			form={form}
			onChange={onChange}
			onSubmit={onSubmit}
			error={error}
		/>
	);
};

export default RegisterForm;
