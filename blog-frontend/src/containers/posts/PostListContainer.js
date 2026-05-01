import qs from 'qs';
import { useSelector } from 'react-redux';
import PostList from '../../components/posts/PostList';
import { useParams, useLocation } from 'react-router-dom';
import { useListPostsQuery } from '../../lib/api/posts';

const PostListContainer = () => {
	const location = useLocation();
	const user = useSelector((state) => state.user.user);
	const { username } = useParams();
	const { tag, page } = qs.parse(location.search, {
		ignoreQueryPrefix: true,
	});
	const { data, error, isLoading } = useListPostsQuery({ tag, username, page });

	return (
		<PostList
			loading={isLoading}
			error={error}
			posts={data?.posts}
			showWriteButton={user}
		/>
	);
};

export default PostListContainer;
