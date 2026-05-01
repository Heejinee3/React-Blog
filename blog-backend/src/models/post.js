import mongoose from 'mongoose';

const { Schema } = mongoose;

const PostSchema = new Schema({
	title: String,
	body: String,
	tags: [String],
	publishedDate: {
		type: Date,
		default: Date.now,
	},
	user: {
		_id: mongoose.Types.ObjectId,
		username: String,
	},
});

PostSchema.statics.list = async function ({ page, username, tag }) {
	const query = {
		...(username ? { 'user.username': username } : {}),
		...(tag ? { tags: tag } : {}),
	};

	const posts = await this.find(query)
		.sort({ _id: -1 })
		.limit(10)
		.skip((page - 1) * 10)
		.lean()
		.exec();

	const count = await this.countDocuments(query).exec();

	return { posts, count };
};

const Post = mongoose.model('Post', PostSchema);
export default Post;
