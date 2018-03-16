import { Button, Card, CardContent, Grid, Typography } from 'material-ui';
import { StyleRulesCallback, Theme, withStyles } from 'material-ui/styles';
import React from 'react';

const styles: StyleRulesCallback = (theme: Theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: '12px !important',
    paddingBottom: '12px !important',
  },
  avatar: {
    flex: '0 0 auto',
    width: 40,
    marginRight: theme.spacing.unit * 2,
  },
  content: {
    flex: '1 1 auto',
  },
  collapseButton: {
    flex: '0 0 auto',
    width: 48,
  },
  right: {
    textAlign: 'right',
  },
  interval: {
    fontSize: 12,
    color: 'grey',
  },
});

export const PortfolioPositionHeader = withStyles(styles)(({ classes }) => (
  <Card>
    <CardContent className={classes.root}>
      <div className={classes.avatar} />
      <div className={classes.content}>
        <Grid container>
          <Grid item xs={3}>
            <Typography type="subheading">Coin</Typography>
          </Grid>
          <Grid item xs={2} className={classes.right}>
            <Typography type="subheading">Quantity</Typography>
          </Grid>
          <Grid item xs={3} className={classes.right}>
            <Typography type="subheading">Price</Typography>
          </Grid>
          <Grid item xs={2} className={classes.right}>
            <Typography type="subheading">Change</Typography>
          </Grid>
        </Grid>
      </div>
      <div className={classes.collapseButton} />
    </CardContent>
  </Card>
));
