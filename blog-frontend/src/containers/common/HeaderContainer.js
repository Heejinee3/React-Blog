import { useSelector } from 'react-redux';
import Header from '../../components/common/Header';
import { useLogoutMutation } from '../../lib/api/auth';
import logger from '../../lib/logger';

const HeaderContainer = () => {
	const user = useSelector((state) => state.user.user);
	const [logout] = useLogoutMutation();

	// 로그아웃
	const onLogout = async () => {
		try {
			await logout().unwrap();
		} catch (e) {
			logger.log(e);
		}
	};

	return <Header user={user} onLogout={onLogout} />;
};

export default HeaderContainer;
