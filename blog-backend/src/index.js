import 'dotenv/config';
import Router from 'koa-router';
import Koa from 'koa';
import api from './api/api.js';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import jwtMiddleware from './lib/jwtMiddleware.js';
import logger from './lib/logger.js';
import serve from 'koa-static';
import path from 'path';
import send from 'koa-send';
import { fileURLToPath } from 'url';

const { PORT, MONGO_URI } = process.env;

mongoose
	.connect(MONGO_URI)
	.then(() => {
		logger.debug('Connected to MongoDB');
	})
	.catch((e) => {
		logger.error(e);
	});

const app = new Koa();
const router = new Router();

router.use('/api', api.routes());

app.use(bodyParser());
app.use(jwtMiddleware);
app.use(router.routes()).use(router.allowedMethods());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildDirectory = path.resolve(__dirname, '../../blog-frontend/build');
app.use(serve(buildDirectory));
app.use(async (ctx) => {
	// Not Found 이고, 주소가 /api 로 시작하지 않는 경우
	if (ctx.status === 404 && ctx.path.indexOf('/api') !== 0) {
		await send(ctx, 'index.html', { root: buildDirectory });
	}
});

const port = PORT || 4000;
app.listen(port, () => {
	logger.debug('Listening to port %d', port);
});
