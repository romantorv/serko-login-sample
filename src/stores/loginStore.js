import { types, flow } from 'mobx-state-tree';

import * as logger from 'utils/logger';
import RequestActions from './actions';

const LoginStore = types
	.model('LoginStore', {
		email: '',
		password: '',
		message: '',
		state: types.enumeration('State', ['initial', 'loaded', 'fetching', 'error']),
		stateTarget: types.maybeNull(types.string),
	})
	.views(self => ({
		get __ready() {
			return self.state !== 'initial' ? true : false;
		},
		get __passwordValidation() {
			if (self.password === '') return { valid: false, message: 'Password is mandatory.' };
			return { valid: true };
		},
		get __emailValidation() {
			if (self.email === '') return { valid: false, message: 'Email or Username is mandatory' };
			return { valid: true };
		},
		get __formValidation() {
			return self.__passwordValidation.valid &&
				self.__emailValidation.valid;
		},
		get __data() {
			return {
				email: self.email,
				password: self.password,
			}
		},
	}))
	.actions(self => ({
		...RequestActions,
		doLogin: flow(function* doLogin({ cancelToken = null }) {
			try {
				self.state = 'fetching';
				self.stateTarget = 'form';
				// const response = yield self.fetch({
				// 	url: AppConfig.API_SIGN_IN,
				// 	cancelToken: cancelToken,
				// 	data: self.__data
				// });

				// Simulate the error
				if ( self.email !== 'newuser@serko.com' || self.password !== 'Abc123' ){
					const errorResponse = {
						data: {
							title: 'Username or Password incorrect!'
						}
					};
					throw errorResponse;
				}
				//
				const response = yield Promise.resolve({token: 'gothetoken'})
				// if having return token then store inside the localStorage / sessionStorage
				const token = response.token;
				self.state = 'loaded';
				self.stateTarget = null;
				logger.store('LoginStore:doLogin: response', response);
				return { token };
			} catch (errorResponse) {
				logger.store('LoginStore:doLogin: fail', errorResponse.status);
				const result = errorResponse.data;
				self.state = 'error';
				self.stateTarget = 'form';
				self.message = result.title;
				// throw new Error('Not login successfully');
			}
		}),
		onChange({ key, value }) {
			self[key] = value;
		}
	}));

export default LoginStore;