import { useNavigate, useParams } from 'react-router-dom';
import PostViewer from '../../components/post/PostViewer';
import { useReadPostQuery } from '../../lib/api/posts';
import PostButtons from '../../components/post/PostButtons';
import { useDispatch, useSelector } from 'react-redux';
import { setOriginalPost } from '../../modules/write';
import { useRemovePostMutation } from '../../lib/api/posts';
import logger from '../../lib/logger';

const PostViewerContainer = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { postId } = useParams();
	const { data, error, isLoading } = useReadPostQuery(postId);
	const [removePost] = useRemovePostMutation();
	const user = useSelector((state) => state.user.user);
	const post = data?.post;
	const isMyPost = user?._id === post?.user?._id;

	const onEdit = () => {
		dispatch(setOriginalPost(post));
		navigate('/write');
	};

	const onRemove = async () => {
		try {
			await removePost(postId).unwrap();
			navigate('/');
		} catch (e) {
			alert('서버 오류가 발생했습니다.');
			logger.log(e);
		}
	};

	return (
		<PostViewer
			post={post}
			loading={isLoading}
			error={error}
			actionButtons={
				isMyPost && <PostButtons onEdit={onEdit} onRemove={onRemove} />
			}
		/>
	);
};

export default PostViewerContainer;
