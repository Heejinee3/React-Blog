import styled from 'styled-components';
import Responsive from '../common/Responsive';

const ErrorBlockWrapper = styled(Responsive)`
	margin-top: 6rem;
	display: flex;
	justify-content: center;
`;

const Card = styled.div`
	padding: 3rem 2.5rem;
	border-radius: 12px;
	background: #fff;
	box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
	text-align: center;
	max-width: 360px;
	width: 100%;
`;

const Icon = styled.div`
	font-size: 2.5rem;
	margin-bottom: 1rem;
`;

const Title = styled.h2`
	margin: 0;
	font-size: 1.4rem;
	color: #333;
`;

const SubText = styled.p`
	margin-top: 0.75rem;
	color: #888;
	font-size: 0.95rem;
`;

const ErrorBlock = () => {
	return (
		<ErrorBlockWrapper>
			<Card>
				<Icon>⚠️</Icon>
				<Title>문제가 발생했어요</Title>
				<SubText>잠시 후 다시 시도해주세요</SubText>
			</Card>
		</ErrorBlockWrapper>
	);
};

export default ErrorBlock;
