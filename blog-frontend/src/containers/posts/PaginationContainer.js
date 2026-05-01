import Pagination from '../../components/posts/Pagination';
import qs from 'qs';
import { useListPostsQuery } from '../../lib/api/posts';
import { useParams, useLocation } from 'react-router-dom';

const PaginationContainer = () => {
	const location = useLocation();
	const { username } = useParams();
	const { tag, page: rawPage } = qs.parse(location.search, {
		ignoreQueryPrefix: true,
	});
	const { data, isLoading, error } = useListPostsQuery({
		tag,
		username,
		page: rawPage,
	});
	const page = parseInt(rawPage || '1', 10);

	if (isLoading || error || !data) return null;

	return (
		<Pagination
			tag={tag}
			username={username}
			page={page}
			lastPage={data.lastPage}
		/>
	);
};

export default PaginationContainer;
