import { Avatar, Card, CardContent, Grid, Typography, withStyles } from 'material-ui';
import { AccountBalanceWallet } from 'material-ui-icons';
import { StyleRulesCallback } from 'material-ui/styles';
import React from 'react';

const styles: StyleRulesCallback = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: theme.palette.text.secondary,
    flex: '0 0 auto',
    margin: 5,
    marginRight: theme.spacing.unit * 2,
    width: 30,
    height: 30,
  },
  content: {
    flex: '1 1 auto',
  },
  right: {
    textAlign: 'right',
  },
});

interface Props {
  asset: string;
  balance: number;
}

export const PortfolioPositionWalletRow = withStyles(styles)<Props>(
  ({ asset, balance, classes }) => (
    <Card>
      <CardContent className={classes.root}>
        <div>
          <Avatar className={classes.avatar}>
            <AccountBalanceWallet />
          </Avatar>
        </div>
        <div className={classes.content}>
          <Grid container>
            <Grid item xs={3}>
              <Typography variant="body2" component="span">
                Wallets
              </Typography>
            </Grid>
            <Grid item xs={2} className={classes.right}>
              <Typography>{`${balance.toPrecision(5)} ${asset}`}</Typography>
            </Grid>
          </Grid>
        </div>
        <div style={{ width: 48 }} />
      </CardContent>
    </Card>
  )
);
