import React from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';

import axios from 'axios';
import {
	Typography,
	Grid,
	TextField,
	Button,
	Link,
	Snackbar,
} from '@material-ui/core';
import { Link as RouterLink, Redirect } from 'react-router-dom';

import * as logger from 'utils/logger';
import * as AppConfig from 'app.config';
import { withCompactLayout, Alert, LangText } from 'components/common';

import LoginStore from 'stores/loginStore';

const LoginPage = inject('store')(
	observer(
		class LoginPage extends React.Component {
			constructor() {
				super();
				this.state = {
					password: false,
					email: false,
					message: false,
					redirect: null,
				}
				this.axiosSource = axios.CancelToken.source();
				this.onChangeValue = this.onChangeValue.bind(this);
				this.onHideSnackBar = this.onHideSnackBar.bind(this);
				this.onSubmit = this.onSubmit.bind(this);
			}

			componentDidMount() {
				logger.log('SignUpPage:componentDidMount');
			}

			componentWillUnmount() {
				logger.log('SignUpPage:componentWillUnmount');
				this.axiosSource.cancel('Stop by user');
			}

			onChangeValue({ target }) {
				this.props.pageStore.onChange({
					key: target.name,
					value: target.value
				});
			}

			onHideSnackBar() {
				this.props.pageStore.onChange({
					key: 'stateTarget',
					value: null
				});
			}

			async onSubmit(event) {
				event.preventDefault();
				if (!this.props.pageStore.__formValidation) {
					this.setState({
						password: true,
						email: true,
					});
					return;
				}
				//
				try {
					const result = await this.props.pageStore.doLogin({
						cancelToken: this.axiosSource.token
					});
					// result = { token: 'gotthetoken', forwardUrl: '/private' };
					await this.props.store.updateToken(result.token);
					this.props.routeConfig.history.push(AppConfig.ROUTE_PRIVATE);
					// below action only applicable with real API as simulated promised not support cancelToken 
					// this.setState({redirect: AppConfig.ROUTE_PRIVATE });
				} catch (error) {
					logger.error('SignUp:onSubmit:', error);
				}
			}

			render() {
				const {
					email,
					password,
					message,
					state,
					stateTarget,
					__passwordValidation,
					__emailValidation,
				} = this.props.pageStore;
				const { authenticated } = this.props;
				return (
					<React.Fragment>
						{ authenticated && this.state.redirect !== null && <Redirect to={ this.state.redirect } /> }
						<Typography
							color="textSecondary"
							component="h1"
							variant="h6"
							align="center">
								<LangText name="label__heading_signin">Sign In</LangText>
							</Typography>
						<Grid
							container
							spacing={3}
							direction="column"
							component="form"
							onSubmit={this.onSubmit}
							noValidate
						>
							<Grid item>
								<TextField
									required
									id="email"
									autoComplete="username"
									value={email}
									onChange={this.onChangeValue}
									name="email"
									label="Email / Username"
									fullWidth
									helperText={this.state.email && !__emailValidation.valid && __emailValidation.message}
									error={this.state.email && !__emailValidation.valid}
								/>
							</Grid>
							<Grid item>
								<TextField
									required
									id="password"
									autoComplete="current-password"
									value={password}
									onChange={this.onChangeValue}
									name="password"
									label="Password"
									type="password"
									fullWidth
									helperText={this.state.password && !__passwordValidation.valid && __passwordValidation.message}
									error={this.state.password && !__passwordValidation.valid}
								/>
							</Grid>
							<Grid item>
								<Button
									fullWidth
									size="large"
									variant="contained"
									type="submit"
									color="primary"><LangText name="label__signin">SIGN IN</LangText></Button>
							</Grid>
							<Grid item>
								<Typography
									component="p"
									align="center">
									<LangText name="label__no_account">Don't have an account?</LangText> &nbsp;
									<Link to={AppConfig.ROUTE_SIGNUP} component={RouterLink}>
										<LangText name="label__register">Register</LangText>
									</Link>
								</Typography>
							</Grid>
						</Grid>
						<Snackbar
							anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
							open={state === 'error' && stateTarget === 'form'}
						>
							<Alert variant="error" message={message} onClose={this.onHideSnackBar} />
						</Snackbar>
					</React.Fragment>
				)
			}
		}
	)
);

LoginPage.defaultProps = {
	authenticated: false
};

LoginPage.propTypes = {
	authenticated: PropTypes.bool,
	routeConfig: PropTypes.object,
	pageStore: PropTypes.object
}

const PageWrapper = (props) => {
	const pageStore = LoginStore.create({ state: 'initial' });
	return <LoginPage pageStore={pageStore} {...props} />;
}
export default withCompactLayout(PageWrapper);