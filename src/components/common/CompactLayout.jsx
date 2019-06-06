import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/styles/withStyles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';

import * as AppConfig from 'app.config';
import Footer from './Footer';

const componentStyles = theme => ({
	layout: {
		width: 'auto',
		marginLeft: theme.spacing(2),
		marginRight: theme.spacing(2),
		marginBottom: theme.spacing(2),
		[theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
			width: 400,
			marginLeft: 'auto',
			marginRight: 'auto',
		},
	},
	paper: {
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(1),
		padding: theme.spacing(2),
		[theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
			marginTop: theme.spacing(6),
			marginBottom: theme.spacing(2),
			padding: theme.spacing(3),
		},
	},
	logo__form_center: {
		width: 60,
		margin: '0 auto',
		marginBottom: theme.spacing(2),
		display: 'block'
	}
});

const CompactLayout = (Component) => {
	const WithStyledComponent = (props) => {
		const { classes, ...otherProps } = props;

		return (
			<Box component="section" className={classes.layout}>
				<Paper className={classes.paper}>
					<Link to={AppConfig.ROUTE_INDEX}>
						<img
							src={`${process.env.PUBLIC_URL}/static/media/logo.svg`}
							alt="Serko's logo"
							className={classes.logo__form_center} />
					</Link>
					<Component {...otherProps} />
				</Paper>
				<Footer />
				
			</Box>
		)
	}
	WithStyledComponent.propTypes = {
		classes: PropTypes.object.isRequired
	}
	return withStyles(componentStyles)(WithStyledComponent);
};

export default CompactLayout;