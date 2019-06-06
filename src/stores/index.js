import { types, onPatch } from 'mobx-state-tree';

import * as AppConfig from 'app.config';
import LocaleStore from './localeStore';

const rootStore = types
	.model('RootStore', {
		token: '',
		locale: types.maybe( LocaleStore )
	})
	.views( self => ({
		get __lang(){
			return self.locale.__language || 'en';
		},
		get __authenticated(){
			return self.token !== '' ? true : false;
		},
	}))
	.actions( self => ({
		afterCreate(){
			//
			const token = localStorage.getItem( AppConfig.TOKEN_NAME );
			if ( token && token !== ''){
				self.token = token;
			}
			//
			onPatch( self, self.onPatchAction );
			// creating multi language store
			self.locale = LocaleStore.create({
				state: 'initial'
			});
		},
		updateToken(value){
			self.token = value;
		},
		onSignOut(){
			self.token = '';
		},
		onPatchAction({op, path, value}){
			// auto update the localStorage once the token is recorded
			if ( op === 'replace' && path === '/token' ){
				localStorage.setItem(AppConfig.TOKEN_NAME, value);
			}
		}
	}));

export default rootStore;