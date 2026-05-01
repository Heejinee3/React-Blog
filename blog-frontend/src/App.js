import { Route, Routes } from 'react-router-dom';
import PostListPage from './pages/PostListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WritePage from './pages/WritePage';
import PostPage from './pages/PostPage';
import { useCheckQuery } from './lib/api/auth';
import ProtectedRoute from './routes/ProtectedRoute';
import { Helmet } from 'react-helmet-async';

function App() {
	useCheckQuery();

	return (
		<>
			<Helmet>
				<title>REACTERS</title>
			</Helmet>
			<Routes>
				<Route index element={<PostListPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route element={<ProtectedRoute />}>
					<Route path="/write" element={<WritePage />} />
					<Route path="/:username">
						<Route index element={<PostListPage />} />
						<Route path=":postId" element={<PostPage />} />
					</Route>
				</Route>
			</Routes>
		</>
	);
}

export default App;
