import { types } from 'mobx-state-tree';

const LanguageModel = types
	.model('LanguageModel', {
		id: types.string,
		values: types.array( types.frozen(), {}),
	})
	.views( self => ({
		__getValue(localeId){
			return self.values.find( label => Object.keys(label) === localeId );
		}
	}));

export default LanguageModel;