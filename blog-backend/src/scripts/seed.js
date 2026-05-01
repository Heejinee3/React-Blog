import 'dotenv/config';
import mongoose from 'mongoose';
import Post from '../models/post.js';

const { MONGO_URI } = process.env;

const users = [
	{ _id: '69e793f3430cc206f4ec48a4', username: 'test1' },
	{ _id: '69e7b8207f59b9f9aac65259', username: 'test2' },
];

const tagPool = [
	['dev', 'backend'],
	['frontend', 'ui'],
	['dev', 'frontend'],
	['backend', 'architecture'],
	['ui', 'design'],
	['fullstack'],
];

// 랜덤 요소 뽑기
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const makePost = (i) => ({
	title: `Test Post ${i + 1}`,
	body: `This is dummy post content number ${i + 1}`,
	tags: randomItem(tagPool),
	publishedDate: new Date(Date.now() - Math.floor(Math.random() * 1000000000)),
	user: randomItem(users),
});

const run = async () => {
	await mongoose.connect(MONGO_URI);
	console.log('MongoDB connected');

	// 기존 데이터 삭제
	await Post.deleteMany({});
	console.log('Posts cleared');

	// 50개 생성 (user 2명 번갈아가면서)
	const posts = Array.from({ length: 50 }).map((_, i) => makePost(i));
	await Post.insertMany(posts);
	console.log('50 posts inserted');

	await mongoose.disconnect();
	process.exit(0);
};

run().catch((err) => {
	console.error(err);
	process.exit(1);
});
