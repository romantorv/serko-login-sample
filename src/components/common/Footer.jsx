import React from 'react';
import { observer, inject } from 'mobx-react';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

import LangText from './LangText';

const Footer = inject('store')(observer(
	({ store }) => {
		return (
			<Grid
				container
				direction="column"
				justify="center"
				alignItems="center"
				spacing={3}
			>
				<Typography
					component="p"
					color="textSecondary"
					align="center"
					style={{ margin: '10px auto' }}>
					<LangText name="label__copyright">Powered by Serko</LangText>
				</Typography>
				<Grid
					container
					direction="row"
					justify="center"
					alignItems="center"
					>
						<Icon style={{ marginRight: 15 }}>language</Icon>
						{ store.locale.__localeOptions.map( (item, index) => <Button 
							key={index}
							onClick={ () => store.locale.doChangeLanguage(item.id) }
							disabled={ item.active } 
							color={ !item.active ? 'primary' : null }
							size="small">{item.label}</Button> ) }
				</Grid>
			</Grid>
		);
	}
));

export default Footer;