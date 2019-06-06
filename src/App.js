import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { observer } from 'mobx-react';
import LinearProgress from '@material-ui/core/LinearProgress';

import AppRoutes from './app.routes';
import * as AppConfig from './app.config';

const App = (props) => {
	const { store } = props;
	return (
		<Router>
			<Switch>
				{AppRoutes.map((routeConfig, index) => {
					if (routeConfig.requiredAuth && !store.__authenticated) {
						return <Redirect
							key={index}
							from={routeConfig.path}
							to={AppConfig.ROUTE_INDEX} />
					}
					//
					const LazyLoadedComponent = React.lazy(() => import(`${routeConfig.componentPath}`));
					return <Route
						key={index}
						exact={routeConfig.routeType === 'exact' ? true : false}
						strict={routeConfig.routeType === 'strict' ? true : false}
						path={routeConfig.path}
						component={(route) => <React.Suspense fallback={<LinearProgress color="primary" />} >
							<LazyLoadedComponent
								authenticated={ routeConfig.requiredAuth ? store.__authenticated : null } // using as mandatory props for private pages / modules
								routeConfig={route}
								//language={store.__language} // using for revoke the UI once changing language
							// locale={store.locale}
							/>
						</React.Suspense>
						}
					/>;
				})
				}
			</Switch>
		</Router>
	);
};

export default observer(App);
