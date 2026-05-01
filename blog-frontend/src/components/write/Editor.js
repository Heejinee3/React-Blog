import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import Responsive from '../common/Responsive';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Toolbar from './Toolbar';

const EditorBlock = styled(Responsive)`
	padding-top: 5rem;
	padding-bottom: 5rem;
`;

const TitleInput = styled.input`
	font-size: 3rem;
	outline: none;
	padding-bottom: 0.5rem;
	border: none;
	border-bottom: 1px solid ${palette.gray[4]};
	margin-bottom: 2rem;
	width: 100%;
`;

const EditorWrapper = styled.div`
	.ProseMirror {
		min-height: 320px;
		font-size: 1.125rem;
		line-height: 1.5;
		outline: none;
	}
`;

const Editor = ({ title, body, onChangeField }) => {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Link.configure({
				openOnClick: false,
			}),
			Image,
		],
		content: body || '',
		onUpdate: ({ editor }) => {
			onChangeField({
				key: 'body',
				value: editor.getHTML(),
			});
		},
	});

	const onChangeTitle = (e) => {
		onChangeField({
			key: 'title',
			value: e.target.value,
		});
	};

	return (
		<EditorBlock>
			<TitleInput
				placeholder="제목을 입력하세요"
				onChange={onChangeTitle}
				value={title}
			/>
			<EditorWrapper>
				<Toolbar editor={editor} />
				<EditorContent editor={editor} />
			</EditorWrapper>
		</EditorBlock>
	);
};

export default Editor;
