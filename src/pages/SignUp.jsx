import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
//
import {
	Typography,
	Grid,
	TextField,
	Select,
	FormControl,
	InputLabel,
	MenuItem,
	Button,
	FormHelperText,
	Snackbar
} from '@material-ui/core';
//
import * as logger from 'utils/logger';
import * as AppConfig from 'app.config';
import { withCompactLayout, Alert } from 'components/common';
//
import SignUpStore from 'stores/signupStore';

const SignUpPage = inject('store')(
	observer( class SignUpPage extends React.Component {
	constructor() {
		super();
		this.state = {
			retype: false,
			password: false,
			email: false,
			message: false,
			redirect: AppConfig.ROUTE_PRIVATE,
		}
		this.axiosSource = axios.CancelToken.source();
		this.onChangeValue = this.onChangeValue.bind(this);
		this.onCheckValidate = this.onCheckValidate.bind(this);
		this.onUncheckValidate = this.onUncheckValidate.bind(this);
		this.onHideSnackBar = this.onHideSnackBar.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	componentDidMount(){
		logger.log('SignUpPage:componentDidMount');
		this.props.pageStore.fetchPreferredLanguage({
			cancelToken: this.axiosSource.token
		});
	}

	componentWillUnmount(){
		logger.log('SignUpPage:componentWillUnmount');
		this.axiosSource.cancel('Stop by user');
	}

	onChangeValue({ target }) {
		this.props.pageStore.onClearValidation(target.name);
		this.props.pageStore.onChange({
			key: target.name,
			value: target.value
		});
	}

	onCheckValidate({target}){
		this.setState({
			[target.name]: true
		})
	}

	onUncheckValidate({target}){
		this.setState({
			[target.name]: false
		})
	}

	onHideSnackBar(){
		this.props.pageStore.onChange({
			key: 'stateTarget',
			value: null
		});
	}

	async onSubmit(event){
		event.preventDefault();
		if ( !this.props.pageStore.__formValidation ) {
			this.setState({
				retype: true,
				password: true,
				email: true,
			});
			return;
		}
		//
		try {
			const result = await this.props.pageStore.doSignUp({
				cancelToken: this.axiosSource.token
			});
			// result = { token: 'gotthetoken', forwardUrl: '/private' };
			this.props.store.updateToken(result.token);
			// this.setState({redirect: result.forwardUrl });

		} catch (error) {
			logger.error('SignUp:onSubmit:', error);
		}
	}

	render() {
		const { 
			email,
			password,
			retype,
			preferredLanguage,
			message,
			state,
			stateTarget,
			__languageOptions,
			__passwordValidation,
			__passwordMatchValidation,
			__emailValidation,
			__languageValidation,
		} = this.props.pageStore;

		const { __authenticated } = this.props.store;

		return (
			<React.Fragment>
				{/* Auto redirect to private dashboard if validated */}
				{ __authenticated && <Redirect to={ this.state.redirect } /> }
				<Typography
					color="textSecondary"
					component="h1"
					variant="h6"
					align="center">Sign up with Serko</Typography>
				<Grid
					container
					spacing={3}
					direction="column"
					noValidate
					component="form"
					onSubmit={ this.onSubmit }
				>
					<Grid item>
						<TextField
							required
							id="email"
							autoComplete="username"
							value={email}
							onChange={ this.onChangeValue }
							onBlur={ this.onCheckValidate }
							onFocus={ this.onUncheckValidate }
							name="email"
							label="Email / Username"
							fullWidth
							helperText={ this.state.email && !__emailValidation.valid && __emailValidation.message }
							error={ this.state.email && !__emailValidation.valid }
						/>
					</Grid>
					<Grid item>
						<TextField
							required
							id="password"
							autoComplete="new-password"
							value={password}
							onChange={ this.onChangeValue }
							onBlur={ this.onCheckValidate }
							onFocus={ this.onUncheckValidate }
							name="password"
							label="Password"
							type="password"
							fullWidth
							helperText={ this.state.password && !__passwordValidation.valid && __passwordValidation.message }
							error={ this.state.password && !__passwordValidation.valid }
						/>
					</Grid>
					<Grid item>
						<TextField
							required
							id="retype"
							autoComplete="new-password"
							value={retype}
							onChange={ this.onChangeValue }
							onBlur={ this.onCheckValidate }
							onFocus={ this.onUncheckValidate }
							name="retype"
							label="Confirm Password"
							type="password"
							fullWidth
							helperText={ this.state.retype && !__passwordMatchValidation.valid && __passwordMatchValidation.message }
							error={ this.state.retype && !__passwordMatchValidation.valid }
						/>
					</Grid>
					<Grid item>
						<FormControl 
							fullWidth 
							required 
							error={ !__languageValidation.valid }
						>
							<InputLabel htmlFor="preferredLanguage">Preferred Language</InputLabel>
							<Select
								id="preferredLanguage"
								name="preferredLanguage"
								onChange={ this.onChangeValue }
								value={ preferredLanguage }
							>
								{ __languageOptions.map( (option, index) => <MenuItem key={index} value={option.id}>{option.label}</MenuItem> )}
							</Select>
							<FormHelperText>
								{ !__languageValidation.valid ? __languageValidation.message : 'Select your preferred language' }
							</FormHelperText>
						</FormControl>

					</Grid>
					<Grid item >
						<Button
							disabled={ state === 'fetching' }
							fullWidth
							size="large"
							variant="contained"
							color="primary"
							type="submit">{
								state === 'fetching' && stateTarget === 'form' ? 'Registering...' : 'Sign Up'
							}</Button>
					</Grid>
				</Grid>
				<Snackbar
					anchorOrigin={{ vertical: 'bottom', horizontal:'center' }}
					open={ state === 'error' && stateTarget === 'form' }
				>
					<Alert variant="error" message={message} onClose={ this.onHideSnackBar } />
				</Snackbar>
			</React.Fragment>
		);
	}
}));

SignUpPage.defaultProps = {
	authenticated: false
};

SignUpPage.propTypes = {
	authenticated: PropTypes.bool,
	routeConfig: PropTypes.object,
	pageStore: PropTypes.object
}

const PageWrapper = (props) => {
	const pageStore = SignUpStore.create({ state: 'initial' });
	return <SignUpPage pageStore={pageStore} {...props} />;
}

export default withCompactLayout( PageWrapper );