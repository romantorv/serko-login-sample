import * as AppConfig from './app.config';

const AppRoutes = [
	{
		path: AppConfig.ROUTE_INDEX,
		componentPath: './pages/Login',
		routeType: 'exact'
	},
	{
		path: AppConfig.ROUTE_SIGNUP,
		componentPath: './pages/SignUp',
		routeType: 'exact'
	},
	{
		path: AppConfig.ROUTE_PRIVATE,
		componentPath: './pages/PrivatePage',
		routeType: 'strict',
		requiredAuth: true,
	},
	{
		path: '*',
		componentPath: './pages/NotFound',
	},
];

export default AppRoutes;