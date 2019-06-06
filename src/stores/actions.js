import { flow } from 'mobx-state-tree';
import axios from 'axios';

import * as logger from 'utils/logger';
import * as AppConfig from 'app.config';

const RequestActions = ({
	get: flow( function* get({
		isAuth=false,
		url,
		cancelToken=null
	}){
		try {
			const headers = {};
			if ( isAuth && localStorage.getItem(AppConfig.TOKEN_NAME) !== null ) headers['X-Access-Token'] =  localStorage.getItem(AppConfig.TOKEN_NAME);
			if ( localStorage.getItem(AppConfig.LANG_ID) !== null ) headers['X-Language-Id'] = localStorage.getItem(AppConfig.LANG_ID);

			const response = yield axios.get( url,
				{
					cancelToken,
					headers
				}
			);
			logger.store('ActionStore:get:SUCCESS: fetching ', url);
			return response.data;
		} catch (error) {
			const { response } = error;
			logger.store('ActionStore:get:ERROR: failed fetching ', url, error);
			throw response;
		}
	}),
	fetch: flow( function* fetch({
		method='POST',
		isAuth=false,
		url,
		data={},
		cancelToken=null
	}){
		try {
			const headers = {};
			if ( isAuth && localStorage.getItem(AppConfig.TOKEN_NAME) !== null ) headers['X-Access-Token'] =  localStorage.getItem(AppConfig.TOKEN_NAME);
			if ( localStorage.getItem(AppConfig.LANG_ID) !== null ) headers['X-Language-Id'] = localStorage.getItem(AppConfig.LANG_ID);
			const response = yield axios.request({
				method,
				cancelToken,
				url,
				data,
				headers
			});
			logger.store('ActionStore:fetch:SUCCESS: fetching ', url);
			return response.data;
		} catch (error) {
			const { response } = error;
			logger.store('ActionStore:fetch:ERROR: failed fetching ', url );
			throw response;
		}
	})
});

export default RequestActions;