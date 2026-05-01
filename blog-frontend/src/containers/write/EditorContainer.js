import React, { useEffect } from 'react';
import Editor from '../../components/write/Editor';
import { useSelector, useDispatch } from 'react-redux';
import { changeField, initializeEditor } from '../../modules/write';

const EditorContainer = () => {
	const dispatch = useDispatch();
	const title = useSelector((state) => state.write.title);
	const body = useSelector((state) => state.write.body);

	// 에디터 입력값 변경
	const onChangeField = (payload) => dispatch(changeField(payload));

	// 초기화
	useEffect(() => {
		return () => {
			dispatch(initializeEditor());
		};
	}, [dispatch]);

	return <Editor onChangeField={onChangeField} title={title} body={body} />;
};

export default EditorContainer;
