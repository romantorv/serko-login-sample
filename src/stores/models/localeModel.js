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
			const found = Object.keys( self.items ).find( itemKey => itemKey === itemId );
			return found ? self.items[found] : null;
		}
	}));

export default LocaleModel;