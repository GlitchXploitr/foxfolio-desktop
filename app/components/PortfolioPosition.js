// @flow

import type { Node } from 'react';
import React, { Component } from 'react';
import classnames from 'classnames';
import { Avatar, Card, CardContent, Grid, IconButton, Typography } from 'material-ui';
import Collapse from 'material-ui/transitions/Collapse';
import { withStyles } from 'material-ui/styles';
import { ExpandMore } from 'material-ui-icons';
import TransactionRow from './TransactionRow';

export const styles = (theme: Object) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    flex: '0 0 auto',
    marginRight: theme.spacing.unit * 2,
  },
  content: {
    flex: '1 1 auto',
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  right: {
    textAlign: 'right',
  },
});

type Props = {
  asset: string,
  coinlist: Object,
  ticker: Object,
  transactions: Object[],
  quantity: number,
  classes: any
};

type State = {
  expanded: boolean
};

class PortfolioPosition extends Component<Props, State> {
  state = {
    expanded: false,
  };

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  rowCard(avatar: Node) {
    const { asset, quantity, classes, coinlist, ticker } = this.props;
    return (
      <CardContent className={classes.root} onClick={this.handleExpandClick}>
        <div className={classes.avatar}>{avatar}</div>
        <div className={classes.content}>
          <Grid container>
            <Grid item xs={3}>
              <Typography type="body2" component="span">
                {coinlist[asset].FullName}
              </Typography>
              <Typography
                type="body2"
                component="span"
                color="secondary"
              >
                {quantity.toPrecision(5)}
              </Typography>
            </Grid>
            <Grid item xs={2} className={classes.right}>
              <Typography type="body2" component="span">
                {`${(ticker[asset].EUR.PRICE * quantity).toFixed(2)}  €`}
              </Typography>
              <Typography type="body2" component="span">
                {`${(ticker[asset].BTC.PRICE * quantity).toPrecision(5)} BTC`}
              </Typography>
            </Grid>
            <Grid item xs={3} className={classes.right}>
              <Typography
                type="body2"
                component="span"
                color="secondary"
              >
                {`${(ticker[asset].EUR.PRICE).toPrecision(5)} €`}
              </Typography>
              <Typography
                type="body2"
                component="span"
                color="secondary"
              >
                {`${(ticker[asset].BTC.PRICE).toPrecision(5)} BTC`}
              </Typography>
            </Grid>
            <Grid item xs={2} className={classes.right}>
              <Typography
                type="body2"
                component="span"
                color="secondary"
              >
                {`${ticker[asset].EUR.CHANGEPCT24HOUR > 0 ? '+' : ''}
                ${(ticker[asset].EUR.CHANGEPCT24HOUR).toFixed(2)}%`}
              </Typography>
              <Typography
                type="body2"
                component="span"
                color="secondary"
              >
                {`${ticker[asset].BTC.CHANGEPCT24HOUR > 0 ? '+' : ''}
                ${(ticker[asset].BTC.CHANGEPCT24HOUR).toFixed(2)}%`}
              </Typography>
            </Grid>
          </Grid>
        </div>
        <div>
          <IconButton
            className={classnames(classes.expand, {
              [classes.expandOpen]: this.state.expanded,
            })}
          >
            <ExpandMore/>
          </IconButton>
        </div>
      </CardContent>
    );
  }

  render() {
    const { asset, coinlist, ticker, transactions } = this.props;
    return (<Card>
      {this.rowCard(
        <Avatar src={coinlist[asset]
          ? `https://www.cryptocompare.com${coinlist[asset].ImageUrl}`
          : ''}
        />,
      )}
      <Collapse in={this.state.expanded}>
        {transactions.map(transaction =>
          <TransactionRow key={transaction.id} style={{ paddingLeft: 50 }} transaction={transaction} ticker={ticker}/>)}
      </Collapse>
    </Card>);
  }
}

export default withStyles(styles)(PortfolioPosition);
