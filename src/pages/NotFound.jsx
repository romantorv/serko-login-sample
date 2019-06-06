import React from 'react';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';


class NotFound extends React.PureComponent {
	render() {
		return <Container maxWidth="lg" style={{ margin: '3em 0'}}>
			<Typography align="center" variant="h1">Not Found </Typography>
			<Typography align="center" component="p">
				This is not the web page you are looking for
			</Typography>
		</Container>;
	}
}

export default NotFound;