import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
	typography: {
		fontFamily: [
			'Lato',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
      		'sans-serif',
		].join(','),
	},
	palette: {
		primary: {
			light: '#02a5fe',
			main: '#006ba9',
			dark: '#00507b',
			contrastText: '#FFF',
		},
		secondary: {
			light: '#02a5fe',
			main: '#fa8115',
			dark: '#d46505',
			contrastText: '#FFF',
		},
		variants: {
			success: '#388e3c',
			warning: '#f57c00',
			info: '#00507b',
			error: '#d32f2f',
			contrastText: '#FFF',
		},
		backgroundColor: '#FFF'
	},
});

export default theme;