import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
// 
import AppTheme from './app.theme';
import App from './App';
import RootStore from './stores';
//
const rootStore = RootStore.create();
ReactDOM.render(
	<ThemeProvider theme={ AppTheme }>
		<CssBaseline />
		<Provider store={rootStore}>
			<App store={rootStore} />
		</Provider>
	</ThemeProvider>
, document.getElementById('root'));