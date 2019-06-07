import { types } from 'mobx-state-tree';

const LocaleModel = types
	.model('LocaleModel', {
		default: false,
		id: types.string,
		label: '',
		items: types.optional( types.frozen(), {})
	})
	.views( self => ({
		__getValue(itemId){
			return self.items[itemId] ? self.items[itemId] : null;
		}
	}));

export default LocaleModel;