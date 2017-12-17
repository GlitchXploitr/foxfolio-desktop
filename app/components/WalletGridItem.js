// @flow
import React, { Component } from 'react';
import { Button, Card, CardActions, CardContent, Typography } from 'material-ui';
import { withStyles } from 'material-ui/styles';
import style from './Source.css';
import type { walletType } from '../reducers/wallets';

const styles = theme => ({
  subheader: {
    marginBottom: 12,
    color: theme.palette.text.secondary,
  },
});

type Props = {
  classes: any,
  wallet: walletType,
  onEdit: (wallet: walletType) => void
};

class WalletGridItem extends Component<Props> {

  render() {
    const { classes, wallet, onEdit } = this.props;
    return (
      <Card className={style.source}>
        <CardContent>
          <Typography type="headline" component="h2">
            {wallet.currency}
          </Typography>
          <Typography type="body1" className={classes.subheader}>
            {`Address: ${wallet.address}`}
            <br/>
            {`Quantity: ${wallet.quantity}`}
            <br/>
            {`Note: ${wallet.note ? wallet.note : ''}`}
          </Typography>
        </CardContent>
        <CardActions>
          <Button dense color="primary" onClick={() => onEdit(wallet)}>Edit</Button>
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(WalletGridItem);
