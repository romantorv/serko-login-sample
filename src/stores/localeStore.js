import { types, onPatch, getSnapshot } from 'mobx-state-tree';

import * as AppConfig from 'app.config';
import * as logger from 'utils/logger';

import LocaleModel from './models/localeModel';
import * as localeFile  from 'language.i18n.json';

const LocaleStore = types
	.model('LocaleStore',{
		locales: types.array( LocaleModel, []),
		lang: 'en',
		currentLocale: types.maybeNull( LocaleModel ),
		state: types.enumeration('State', ['initial', 'loaded', 'fetching', 'error']),
	})
	.views( self => ({
		get __ready(){
			return self.state !== 'initial' ? true : false;
		},
		get __lang(){
			return self.lang;
		},
		get __localeOptions(){
			return self.locales.reduce( (result, item) => {
				result.push({
					id: item.id,
					label: item.label,
					active: item.id === self.lang ? true : false
				});
				return result;
			}, []);
		},
		__getLabelById(labelId){
			return self.currentLocale ? self.currentLocale.__getValue(labelId) : null;
		}
	}))
	.actions( self => ({
		afterCreate(){
			const langId = localStorage.getItem( AppConfig.LANG_ID );
			if ( langId !== null && langId !== self.lang ){
				self.lang = langId;
			}
			//
			self.initialStore();
			onPatch(self, self.onPatchAction);
		},
		initialStore(){
			const localJSON = JSON.parse( JSON.stringify(localeFile) );
			localJSON.default['@metadata'].locales.map( item => {
				self.locales.push(
					LocaleModel.create({
						...item,
						items: localJSON.default[item.id]
					})
				);
				// setup the default locale
				if ( item.id === self.lang ){
					self.currentLocale = LocaleModel.create({
						...item,
						items: localJSON.default[item.id]
					})
				}
				return null;
			});			
		},
		doChangeLanguage(value){
			logger.store('LocalStore:doChangeLanguage new value', value);
			self.lang = value;
		},
		onPatchAction({op, path, value}){
			logger.store('LocalStore:onPatchAction', op, path, value);
			if ( op === 'replace' && path === '/lang') {
				localStorage.setItem(AppConfig.LANG_ID, value);
				const foundLocale = self.locales.find( item => item.id === self.lang );
				self.currentLocale = foundLocale ? getSnapshot(foundLocale) : LocaleModel.create({'id': self.lang });
			}
		}
	}));

export default LocaleStore;