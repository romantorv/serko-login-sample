import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import makeStyles from '@material-ui/styles/makeStyles';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';

const icons = {
	success: 'check_circle',
	warning: 'warning',
	error: 'error',
	info: 'help',
}

const componentStyles = makeStyles(theme => ({
	success: {
		backgroundColor: theme.palette.variants.success,
	},
	error: {
		backgroundColor: theme.palette.variants.error,
	},
	info: {
		backgroundColor: theme.palette.variants.info,
	},
	warning: {
		backgroundColor: theme.palette.variants.warning
	},
	icon: {
		fontSize: 20,
	},
	iconVariant: {
		opacity: 0.9,
		marginRight: theme.spacing(1),
	},
	message: {
		display: 'flex',
		alignItems: 'center',
	},
}));

const AlertComponent = (props) => {
	const styles = componentStyles();
	const { className, message, onClose, variant, ...other } = props;
	// const Icon = variantIcon[variant];

	return (
		<SnackbarContent
			className={clsx(styles[variant], className)}
			message={
				<span className={styles.message}>
					<Icon className={clsx(styles.icon, styles.iconVariant)}>{icons[variant]}</Icon>
					{message}
				</span>
			}
			action={[
				(typeof onClose === 'function' && <IconButton key="close" aria-label="Close" color="inherit" onClick={onClose}>
					<Icon className={styles.icon}>close</Icon>
				</IconButton>),
			]}
			{...other}
		/>
	);
}

AlertComponent.defaultProps = {
	variant: 'info',
	onClose: null
};

AlertComponent.propTypes = {
	className: PropTypes.string,
	message: PropTypes.node,
	onClose: PropTypes.func,
	variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};

export default AlertComponent;