import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import Responsive from '../common/Responsive';
import Tags from '../common/Tags';
import SubInfo from '../common/SubInfo';
import ErrorBlock from '../common/ErrorBlock';

const PostViewerBlock = styled(Responsive)`
	margin-top: 4rem;
`;

const PostHead = styled.div`
	border-bottom: 1px solid ${palette.gray[2]};
	padding-bottom: 3rem;
	margin-bottom: 3rem;
	h1 {
		font-size: 3rem;
		line-height: 1.5;
		margin: 0;
	}
`;

const PostContent = styled.div`
	font-size: 1.3125rem;
	color: ${palette.gray[8]};
`;

const PostViewer = ({ post, loading, error, actionButtons }) => {
	if (loading || !post) return null;

	const { title, body, user, publishedDate, tags } = post;

	if (error) {
		if (error.status === 404 || error.status === 400) {
			return <ErrorBlock />;
		}
		return <ErrorBlock />;
	}

	return (
		<PostViewerBlock>
			<PostHead>
				<h1>{title}</h1>
				<SubInfo
					username={user.username}
					publishedDate={publishedDate}
					hasMarginTop={true}
				/>
				<Tags tags={tags} />
			</PostHead>
			{actionButtons}
			<PostContent dangerouslySetInnerHTML={{ __html: body }} />
		</PostViewerBlock>
	);
};

export default PostViewer;
