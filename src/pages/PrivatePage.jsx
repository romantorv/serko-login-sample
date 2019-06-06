import React from 'react';
import { observer, inject } from 'mobx-react';
import {
	Typography,
	Grid,
	Button,
} from '@material-ui/core';

import { withCompactLayout, LangText } from 'components/common';

const PrivatePage = inject('store')(
	observer(
		class PrivatePage extends React.PureComponent {
			constructor(){
				super();
				this.onSignOut = this.onSignOut.bind(this);
			}
			onSignOut(){
				this.props.store.onSignOut()
			}
			render() {
				return (
					<React.Fragment>
						<Grid
							container
							spacing={3}
							direction="column"
							component="form"
							noValidate
						>
							<Grid item>
								<Typography
									color="textSecondary"
									component="h1"
									variant="h6"
									align="center">
									<LangText name="label__heading_private">Serko - Secured Page</LangText>
								</Typography>
							</Grid>
							<Grid item>
								<Typography
									component="p"
									align="center">
									<LangText name="label__welcome">Welcome to Serko's online booking and expense tool</LangText>
							</Typography>
							</Grid>
							<Grid item>
								<Button
									fullWidth
									size="large"
									variant="contained"
									color="primary">GET START</Button>
							</Grid>
								<Typography
									component="p"
									align="center">or</Typography>
							<Grid item>
								<Button
									fullWidth
									size="large"
									variant="contained"
									onClick={ this.onSignOut }
									color="secondary">SIGN OUT</Button>
							</Grid>
						</Grid>
					</React.Fragment>
				)
			}
		})
)

export default withCompactLayout(PrivatePage);