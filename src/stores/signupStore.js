import { types, flow } from 'mobx-state-tree';

import * as AppConfig from 'app.config';
import * as logger from 'utils/logger';
import RequestActions from './actions';

const SignUpStore = types
	.model('SignUpStore', {
		email: '',
		password: '',
		retype: '',
		preferredLanguage: '',
		languageList: types.optional(types.frozen(), {}),
		errors: types.array(types.frozen(), {}),
		message: '',
		state: types.enumeration('State', ['initial', 'loaded', 'fetching', 'error']),
		stateTarget: types.maybeNull(types.string),
	})
	.views(self => ({
		get __ready() {
			return self.state !== 'initial' ? true : false;
		},
		get __languageOptions() {
			if (!self.languageList || Object.keys(self.languageList).length <= 0) return [];
			return Object.keys(self.languageList).reduce((result, keyName) => {
				result.push({
					id: keyName,
					label: self.languageList[keyName]
				});
				return result;
			}, []);
		},
		get __passwordValidation() {
			if (self.password === '') return { valid: false, message: 'Please fill out this field.' }
			const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{5,}$/;
			if ( !passwordPattern.test( self.password.toString() ) ){
				return { valid: false, message: 'Password must have minimum five characters, at least one uppercase letter, one lowercase letter and one number'} 
			}
			const error = self.errors.find(item => item.name === 'password');
			return error ? { valid: false, message: error.reason } : { valid: true };
		},
		get __passwordMatchValidation() {
			if (self.retype === '') return { valid: false, message: 'Please fill out this field.' };
			if (self.retype !== '' && self.retype !== self.password) return { valid: false, message: 'Your retype password is not matched.' };
			return { valid: true };
		},
		get __emailValidation() {
			if (self.email === '') return { valid: false, message: 'Please fill out this field.' }
			// for server-side validation
			const error = self.errors.find(item => item.name === 'email');
			return error ? { valid: false, message: error.reason } : { valid: true };
		},
		get __languageValidation() {
			// for server-side validation only
			const error = self.errors.find(item => item.name === 'preferredLanguage');
			return error ? { valid: false, message: error.reason } : { valid: true };
		},
		get __formValidation() {
			return self.__passwordValidation.valid &&
				self.__passwordMatchValidation.valid &&
				self.__emailValidation.valid &&
				self.__languageValidation.valid;
		},
		get __data() {
			return {
				email: self.email,
				password: self.password,// btoa(self.password), 
				preferredLanguage: self.preferredLanguage
			}
		},
	}))
	.actions(self => ({
		...RequestActions,
		afterCreate() {
			// self.errors = [
			// 	{
			// 		"name": "email",
			// 		"reason": "Already registered"
			// 	},
			// 	{
			// 		"name": "preferredLanguage",
			// 		"reason": "Invalid language"
			// 	}
			// ];
		},
		doSignUp: flow(function* doSignUp({ cancelToken = null }) {
			try {
				self.state = 'fetching';
				self.stateTarget = 'form';
				const response = yield self.fetch({
					url: AppConfig.API_SIGN_UP,
					cancelToken: cancelToken,
					data: self.__data
				});
				// if having return token then store inside the localStorage / sessionStorage
				// const token = response.token;
				// localStorage.setItem( AppConfig.TOKEN_NAME, token);
				self.state = 'loaded';
				self.stateTarget = null;
				logger.store('SignUpStore:doSignUp: response', response);
				return { token: 'gotthetoken' };
			} catch (errorResponse) {
				logger.store('SignUpStore:doSignUp: fail', errorResponse);
				const result = errorResponse.data;
				self.state = 'error';
				self.stateTarget = 'form';
				self.message = result.title;
				self.errors = result['invalid-params'];
				// throw new Error('Not register successfully');
			}
		}),
		fetchPreferredLanguage: flow(function* fetchPreferredLanguage({ cancelToken }) {
			try {
				self.state = 'fetching';
				self.stateTarget = 'preferredLanguages';
				const response = yield self.get({
					url: AppConfig.API_PREFERRED_LANGS,
					cancelToken: cancelToken,
				});
				self.languageList = response.languages;
				self.state = 'loaded';
				self.stateTarget = null;
				logger.store('SignUpStore:fetchPreferredLanguage: response', response);
			} catch (errorResponse) {
				logger.store('SignUpStore:fetchPreferredLanguage: error', errorResponse);
				// const result = errorResponse.data;
				self.state = 'error';
				self.stateTarget = 'form';
				self.message = 'The sign-up form is having problem, please refresh and try again!';
				// throw new Error('The sign-up form is having problem, please refresh and try again!');
			}
		}),
		onChange({ key, value }) {
			self[key] = value;
		},
		onClearValidation(key) {
			if ( self.errors.length < 1 ) return;
			// logger.store('SignUpStore:onClearValidation', key);
			const foundIndex = self.errors.findIndex(item => item.name === key);
			if (foundIndex >= 0) self.errors.splice(foundIndex, 1);
		}
	}));

export default SignUpStore;