import React from 'react';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';

const ToolbarWrapper = styled.div`
	display: flex;
	gap: 6px;
	flex-wrap: wrap;
	margin-bottom: 10px;

	button {
		border: 1px solid ${palette.gray[4]};
		background: white;
		padding: 4px 8px;
		cursor: pointer;
		font-size: 0.85rem;

		&:hover {
			background: ${palette.gray[1]};
		}

		&.active {
			background: ${palette.gray[3]};
		}
	}
`;

const tools = [
	{ type: 'heading', level: 1, label: 'H1' },
	{ type: 'heading', level: 2, label: 'H2' },
	{ type: 'bold', label: 'B' },
	{ type: 'italic', label: 'I' },
	{ type: 'underline', label: 'U' },
	{ type: 'strike', label: 'S' },
	{ type: 'orderedList', label: 'OL' },
	{ type: 'bulletList', label: 'UL' },
	{ type: 'blockquote', label: 'Quote' },
	{ type: 'codeBlock', label: 'Code' },
	{ type: 'link', label: 'Link' },
	{ type: 'image', label: 'Image' },
];

const Toolbar = ({ editor }) => {
	if (!editor) return null;

	const setLink = () => {
		const url = window.prompt('URL 입력');
		if (url) {
			editor
				.chain()
				.focus()
				.extendMarkRange('link')
				.setLink({ href: url })
				.run();
		}
	};

	const setImage = () => {
		const url = window.prompt('Image URL');
		if (url) {
			editor.chain().focus().setImage({ src: url }).run();
		}
	};

	const actions = {
		heading: (level) => editor.chain().focus().toggleHeading({ level }).run(),
		bold: () => editor.chain().focus().toggleBold().run(),
		italic: () => editor.chain().focus().toggleItalic().run(),
		underline: () => editor.chain().focus().toggleUnderline().run(),
		strike: () => editor.chain().focus().toggleStrike().run(),
		orderedList: () => editor.chain().focus().toggleOrderedList().run(),
		bulletList: () => editor.chain().focus().toggleBulletList().run(),
		blockquote: () => editor.chain().focus().toggleBlockquote().run(),
		codeBlock: () => editor.chain().focus().toggleCodeBlock().run(),
		link: setLink,
		image: setImage,
	};

	const handleClick = (item) => {
		if (item.type === 'heading') {
			actions.heading(item.level);
		} else {
			actions[item.type]?.();
		}
	};

	return (
		<ToolbarWrapper>
			{tools.map((item, idx) => (
				<button key={idx} onClick={() => handleClick(item)}>
					{item.label}
				</button>
			))}
		</ToolbarWrapper>
	);
};

export default Toolbar;
