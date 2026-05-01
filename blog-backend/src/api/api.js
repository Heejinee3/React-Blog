import Router from 'koa-router';
import posts from './posts/posts.routes.js';
import auth from './auth/auth.routes.js';

const api = new Router();

api.use('/posts', posts.routes());
api.use('/auth', auth.routes());

export default api;
