// @flow
import React from 'react';
import { Paper, Typography, withStyles } from 'material-ui';
import { openInBrowser } from '../helpers/electron';

const version = process.env.VERSION || '';

const styles = () => ({
  paper: { marginTop: 30, padding: 25 },
});

type Props = {
  classes: Object
};

function AboutPage({ classes }: Props) {
  return (
    <div className="container">
      <Paper className={classes.paper}>
        <Typography type="display1">About Foxfolio</Typography>
        <Typography type="caption" paragraph>Version {version}</Typography>
        <Typography type="body2">
          Portfolio management application for cryptocurrencies&nbsp;
          which automatically retrieves balances and trades using exchange APIs.
        </Typography>
        <Typography type="caption" paragraph>
          Created by Andreas Greimel
        </Typography>
        <Typography paragraph>
          Website <a href="http://foxfol.io" onClick={openInBrowser}>foxfol.io</a><br/>
          Sources on <a href="https://github.com/foxfolio" onClick={openInBrowser}>GitHub</a>
        </Typography>
        <Typography paragraph>
          Price data retrieved using the&nbsp;
          <a href="https://www.cryptocompare.com/api/" onClick={openInBrowser}>
            CryptoCompare API
          </a>
          , licensed under&nbsp;
          <a href="https://creativecommons.org/licenses/by-nc/3.0/" onClick={openInBrowser}>
            Creative Commons Attribution-NonCommercial 3.0 Unported (CC BY-NC 3.0)
          </a>
        </Typography>
      </Paper>
    </div>
  );
}

export default withStyles(styles)(AboutPage);
