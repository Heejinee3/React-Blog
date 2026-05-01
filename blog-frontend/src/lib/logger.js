const isDev = process.env.NODE_ENV === 'development';

const logger = {
	log: (...args) => {
		if (isDev) {
			console.log('[log]', ...args);
		}
	},

	info: (...args) => {
		if (isDev) {
			console.info('[INFO]', ...args);
		}
	},

	warn: (...args) => {
		if (isDev) {
			console.warn('[WARN]', ...args);
		}
	},

	error: (error, context = {}) => {
		if (isDev) {
			console.error('[ERROR]', error, context);
		}
	},
};

export default logger;
