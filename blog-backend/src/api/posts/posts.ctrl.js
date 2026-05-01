import Post from '../../models/post.js';
import mongoose from 'mongoose';
import Joi from 'joi';
import sanitizeHtml from 'sanitize-html';

const { ObjectId } = mongoose.Types;

// html 을 없애고 내용이 너무 길으면 200자로 제한시키는 함수
const removeHtmlAndShorten = (body) => {
	const filtered = sanitizeHtml(body, {
		allowedTags: [],
	});
	return filtered.length < 200 ? filtered : `${filtered.slice(0, 200)}...`;
};

// 게시글 ID 검사 및 조회 후 ctx.state에 저장하는 middleware
export const getPostById = async (ctx, next) => {
	// id가 올바른지 확인
	const { id } = ctx.params;
	if (!ObjectId.isValid(id)) {
		ctx.status = 400;
		ctx.body = {
			message: '게시글 아이디가 올바르지 않습니다.',
		};
		return;
	}
	try {
		// 게시글아 존재하는지 확인
		const post = await Post.findById(id);
		if (!post) {
			ctx.status = 404;
			ctx.body = {
				message: '게시글이 존재하지 않습니다.',
			};
			return;
		}

		ctx.state.post = post;

		return next();
	} catch (e) {
		ctx.throw(500, e);
		ctx.body = {
			message: '서버 오류가 발생했습니다.',
		};
	}
};

// 게시글 작성자 확인
export const checkOwnPost = (ctx, next) => {
	const { user, post } = ctx.state;
	if (post.user._id.toString() !== user._id) {
		ctx.status = 403;
		ctx.body = {
			message: '작성자만 접근할 수 있습니다.',
		};
		return;
	}
	return next();
};

/* 게시글 작성
	요청 (Request)
	POST /api/posts
	{ 
		title: '제목', 
		body: '<p>내용</p>', 
		tags: [ '태그1', '태그2' ] 
	}

	응답 (Response)
	{
		message: '게시글 작성 성공',
		post: {
			title: '제목',
			body: '<p>내용</p>',
			tags: [ '태그1', '태그2' ],
			user: {
				_id: new ObjectId('69e7b8207f59b9f9aac65259'),
				username: 'test2'
			},
			_id: new ObjectId('69f3af814664da47245b2f50'),
			publishedDate: 2026-04-30T19:37:38.001Z,
			__v: 0
		}
	}
*/
export const write = async (ctx) => {
	// 요청 데이터 검증
	const schema = Joi.object()
		.keys({
			title: Joi.string().required(),
			body: Joi.string().required(),
			tags: Joi.array().items(Joi.string()).required(),
		})
		.unknown(false);
	const result = schema.validate(ctx.request.body);
	if (result.error) {
		ctx.status = 400;
		ctx.body = {
			code: 'INVALID_INPUT',
			error: result.error,
			message: '요청 데이터가 올바르지 않습니다.',
		};
		return;
	}

	// Post 객체 생성
	const { title, body, tags } = ctx.request.body;
	const post = new Post({
		title,
		body,
		tags,
		user: ctx.state.user,
	});

	try {
		// DB에 post 저장
		await post.save();

		// 응답 데이터 구성
		ctx.body = {
			message: '게시글 작성 성공',
			post,
		};
	} catch (e) {
		ctx.throw(500, e);
		ctx.body = {
			message: '서버 오류가 발생했습니다.',
		};
	}
};

/* 게시글 목록 조회
	요청 (Request)
	GET /api/posts?username=&tag=&page=

	응답 (Response)
	{
		posts:
		[
			{
				user: {
				_id: new ObjectId('69e793f3430cc206f4ec48a4'),
				username: 'test1'
				},
				_id: new ObjectId('69edaeaf3b16bc75d8d2f902'),
				title: '제목',
				body: '<p>내용</p>',
				tags: [ '태그1' ],
				publishedDate: 2026-04-26T06:20:31.083Z,
				__v: 0
			},
			...
		]
		"message": "게시글 목록 조회 성공"
	}
*/
export const list = async (ctx) => {
	// 페이지 유효성 검사
	const page = parseInt(ctx.query.page || '1', 10);
	if (page < 1) {
		ctx.status = 400;
		ctx.body = {
			message: '페이지 번호는 1 이상이어야 합니다.',
		};
		return;
	}

	// 게시글 목록 조회
	const { tag, username } = ctx.query;
	try {
		const { posts, count } = await Post.list({
			page,
			username,
			tag,
		});

		// 응답 데이터 구성
		ctx.body = {
			message: '게시글 목록 조회 성공',
			posts: posts.map((post) => ({
				...post,
				body: removeHtmlAndShorten(post.body),
			})),
			lastPage: Math.ceil(count / 10),
		};
	} catch (e) {
		ctx.throw(500, e);
		ctx.body = {
			message: '서버 오류가 발생했습니다.',
		};
	}
};

/* 게시글 조회
	요청 (Request)
	GET /api/posts/:id

	응답 (Response)
	{
		"post": {
			user: { _id: new ObjectId('69e793f3430cc206f4ec48a4'), username: 'test1' },
			_id: new ObjectId('69f096119121511498538859'),
			title: '제목',
			body: '<p>글</p>',
			tags: ['태그1', '태그2'],
			publishedDate: 2026-04-28T11:12:17.247Z,
			__v: 0
		},
		"message": "게시글 조회 성공"
	}
*/
export const read = async (ctx) => {
	ctx.body = {
		post: ctx.state.post,
		message: '게시글 조회 성공',
	};
};

/* 게시글 삭제
	요청 (Request)
	DELETE /api/posts/:id

	응답 (Response)
	{
		message: '게시글 삭제 성공',
	}
*/
export const remove = async (ctx) => {
	const { id } = ctx.params;
	try {
		await Post.findByIdAndDelete(id).exec();
		ctx.status = 204;
		ctx.body = {
			message: '게시글 삭제 성공',
		};
	} catch (e) {
		ctx.throw(500, e);
		ctx.body = {
			message: '서버 오류가 발생했습니다.',
		};
	}
};

/* 게시글 수정 
	요청 (Request)
	PATCH /api/posts/:id
	{ 
		title: '제목', 
		body: '<p>내용</p>', 
		tags: [ '태그1', '태그2' ] 
	}

	응답 (Response)
	{
		message: '게시글 수정 성공',
		post: {
			user: {
				_id: new ObjectId('69e7b8207f59b9f9aac65259'),
				username: 'test2'
			},
			_id: new ObjectId('69f3b17be5badb1ff7626963'),
			title: '제목',
			body: '<p>내용</p>',
			tags: [ '태그1', '태그2' ], 
			publishedDate: 2026-04-30T19:46:03.330Z,
			__v: 0
		}
	}
*/
export const update = async (ctx) => {
	// 요청 데이터 검증
	const schema = Joi.object()
		.keys({
			title: Joi.string(),
			body: Joi.string(),
			tags: Joi.array().items(Joi.string()),
		})
		.unknown(false);
	const result = schema.validate(ctx.request.body);
	if (result.error) {
		ctx.status = 400;
		ctx.body = {
			code: 'INVALID_INPUT',
			error: result.error,
			message: '요청 데이터가 올바르지 않습니다.',
		};
		return;
	}

	const { id } = ctx.params;

	try {
		// 게시글 수정
		const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
			new: true,
		}).exec();
		if (!post) {
			ctx.status = 404;
			ctx.body = {
				message: '게시글 수정 중 오류가 발생했습니다.',
			};
			return;
		}

		// 응답 데이터 구성
		ctx.body = {
			message: '게시글 수정 성공',
			post,
		};
	} catch (e) {
		ctx.throw(500, e);
		ctx.body = {
			message: '서버 오류가 발생했습니다.',
		};
	}
};
