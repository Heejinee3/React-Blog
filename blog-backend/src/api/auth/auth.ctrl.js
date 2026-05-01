import Joi from 'joi';
import User from '../../models/user.js';

/* 회원가입
	요청 (Request)
	POST /api/auth/register
	{
		username: 'velopert',
		password: 'mypass123'
	}

	응답 (Response)
	{
		"user": {
			"_id": "69e0dd5fb5a4683ed96018f2",
			"username": "velopert",
			"__v": 0
		},
		"message": "회원가입 성공"
	}
*/
export const register = async (ctx) => {
	// 요청 데이터 검증
	const schema = Joi.object().keys({
		username: Joi.string().alphanum().min(3).max(20).required(),
		password: Joi.string().required(),
	});
	const result = schema.validate(ctx.request.body);
	if (result.error) {
		ctx.status = 400;
		ctx.body = {
			message: '요청 데이터가 올바르지 않습니다.',
			details: result.error.details,
		};
		return;
	}

	const { username, password } = ctx.request.body;
	try {
		// username 중복 체크
		const exists = await User.findByUsername(username);
		if (exists) {
			ctx.status = 409;
			ctx.body = {
				message: '이미 존재하는 아이디입니다.',
			};
			return;
		}

		const user = new User({
			username,
		});
		await user.setPassword(password); // password 해싱 후 저장
		await user.save(); // DB에 user 저장
		ctx.body = {
			user: user.serialize(), // hashedPassword가 제거된 응답 반환
			message: '회원가입 성공',
		};

		// JWT를 쿠키로 저장
		const token = user.generateToken();
		ctx.cookies.set('access_token', token, {
			maxAge: 1000 * 60 * 60 * 24 * 7,
			httpOnly: true,
		});
	} catch (e) {
		ctx.throw(500, e);
		ctx.body = {
			message: '서버 오류가 발생했습니다.',
		};
	}
};

/* 로그인
	요청 (Request)
	POST /api/auth/login
	{
		username: 'velopert',
		password: 'mypass123'
	}

	응답 (Response)
	{
		"user": {
			"_id": "69e0dd5fb5a4683ed96018f2",
			"username": "velopert",
			"__v": 0
		},
		"message": "로그인 성공"
	}
*/
export const login = async (ctx) => {
	// 요청 데이터 검증
	const schema = Joi.object().keys({
		username: Joi.string().alphanum().min(3).max(20).required(),
		password: Joi.string().required(),
	});
	const result = schema.validate(ctx.request.body);
	if (result.error) {
		ctx.status = 400;
		ctx.body = {
			message: '요청 데이터가 올바르지 않습니다.',
			details: result.error.details,
		};
		return;
	}

	const { username, password } = ctx.request.body;
	try {
		// username으로 유저 존재 여부 확인
		const user = await User.findByUsername(username);
		if (!user) {
			ctx.status = 401;
			ctx.body = {
				message: '아이디 또는 비밀번호가 올바르지 않습니다.',
			};
			return;
		}

		// 비밀번호 일치 여부 확인
		const valid = await user.checkPassword(password);
		if (!valid) {
			ctx.status = 401;
			ctx.body = {
				message: '아이디 또는 비밀번호가 올바르지 않습니다.',
			};
			return;
		}

		ctx.body = {
			user: user.serialize(), // hashedPassword가 제거된 응답 반환
			message: '로그인 성공',
		};

		// JWT를 쿠키로 저장
		const token = user.generateToken();
		ctx.cookies.set('access_token', token, {
			maxAge: 1000 * 60 * 60 * 24 * 7,
			httpOnly: true,
		});
	} catch (e) {
		ctx.throw(500, e);
		ctx.body = {
			message: '서버 오류가 발생했습니다.',
		};
	}
};

/* 로그인 여부 확인
	요청 (Request)
	GET /api/auth/check

	응답 (Response)
	{
		"user": {
			"_id": "69e0a6797d957b9d05169b65",
			"username": "velopert"
		},
		"message": "로그인 상태입니다."
	}
*/
export const check = async (ctx) => {
	// 로그인 여부 확인
	const { user } = ctx.state;
	if (!user) {
		ctx.status = 401;
		ctx.body = {
			message: '로그인이 필요합니다.',
		};
		return;
	}

	ctx.status = 200;
	ctx.body = {
		user, // hashedPassword가 제거된 응답 반환
		message: '로그인 상태입니다.',
	};
};

/* 로그아웃
	요청 (Request)
	POST /api/auth/logout

	응답 (Response)
	{
		"message": "로그아웃 상태입니다."
	}
*/
export const logout = async (ctx) => {
	ctx.cookies.set('access_token');
	ctx.status = 204;
	ctx.body = {
		message: '로그아웃 상태입니다.',
	};
};
