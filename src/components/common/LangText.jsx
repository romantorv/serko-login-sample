import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

const LangText = inject('store')(
	observer(({store: {locale}, name, children}) => {
		const labelValue = locale.__getLabelById(name);
		return(
			<React.Fragment>
				{ labelValue ? labelValue : children }
			</React.Fragment>
		);
	})
);

LangText.propTypes = {
	name: PropTypes.string.isRequired,
};

export default LangText;