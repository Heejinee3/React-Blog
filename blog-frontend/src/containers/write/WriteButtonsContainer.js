import { useEffect } from 'react';
import WriteButtons from '../../components/write/WriteButtons';
import { useSelector } from 'react-redux';
import {
	useWritePostMutation,
	useUpdatePostMutation,
} from '../../lib/api/posts';
import logger from '../../lib/logger';
import { useNavigate } from 'react-router-dom';

const WriteButtonsContainer = () => {
	const title = useSelector((state) => state.write.title);
	const body = useSelector((state) => state.write.body);
	const tags = useSelector((state) => state.write.tags);
	const originalPostId = useSelector((state) => state.write.originalPostId);
	const navigate = useNavigate();
	const [writePost, { data: writeData }] = useWritePostMutation();
	const [updatePost, { data: updatedData }] = useUpdatePostMutation();

	const onPublish = async () => {
		try {
			if (originalPostId) {
				await updatePost({
					id: originalPostId,
					title,
					body,
					tags,
				}).unwrap();
			} else {
				await writePost({ title, body, tags }).unwrap();
			}
		} catch (e) {
			if (e?.data?.code === 'INVALID_INPUT') {
				alert('제목과 내용을 입력해주세요');
				return;
			}
			alert('서버 오류가 발생했습니다.');
			logger.error(e);
		}
	};

	const onCancel = () => {
		navigate(-1);
	};

	useEffect(() => {
		const result = writeData?.post || updatedData?.post;
		if (result) {
			const { _id, user } = result;
			navigate(`/${user.username}/${_id}`);
		}
	}, [writeData, updatedData, navigate]);

	return (
		<WriteButtons
			onPublish={onPublish}
			onCancel={onCancel}
			isEdit={!!originalPostId}
		/>
	);
};

export default WriteButtonsContainer;
