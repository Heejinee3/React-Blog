import Responsive from '../components/common/Responsive';
import EditorContainer from '../containers/write/EditorContainer';
import TagBoxContainer from '../containers/write/TagBoxContainer';
import WriteButtonsContainer from '../containers/write/WriteButtonsContainer';

const WritePage = () => {
	return (
		<Responsive>
			<EditorContainer />
			<TagBoxContainer />
			<WriteButtonsContainer />
		</Responsive>
	);
};

export default WritePage;
