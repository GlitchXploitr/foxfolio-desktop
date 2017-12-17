import React, { Component } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Input, InputLabel, MenuItem, Select, TextField } from 'material-ui';
import type { sourceType } from '../reducers/sources';

export default class SourceDialog extends Component {
  props: {
    source: sourceType,
    save: (source: sourceType) => void
  };

  state = {
    name: '',
    apiKey: '',
    apiSecret: '',
    nameValid: true,
    apiKeyValid: true,
    apiSecretValid: true,
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      name: nextProps.source.name,
      customerId: nextProps.source.customerId,
      apiKey: nextProps.source.apiKey,
      apiSecret: nextProps.source.apiSecret,
    });
  }

  save = () => {
    this.props.save({
      name: this.state.name,
      apiKey: this.state.apiKey,
      apiSecret: this.state.apiSecret,
    });
  };

  handleChange = name => event => {
    this.setState(
      { [name]: event.target.value },
    );
  };

  render() {
    const { open, close } = this.props;

    return (
      <Dialog
        title="New Source"
        open={open}
        onRequestClose={close}
      >
        <DialogTitle>New source</DialogTitle>
        <DialogContent>
          <form autoComplete="off">
            <FormControl fullWidth>
              <InputLabel htmlFor="name">Exchange</InputLabel>
              <Select
                value={this.state.name}
                onChange={this.handleChange('name')}
                fullWidth
                input={<Input id="name"/>}
              >
                <MenuItem value="bittrex">Bittrex</MenuItem>
                <MenuItem value="bitstamp">Bitstamp</MenuItem>
              </Select>
            </FormControl>
            {getFormForExchange(this.state.name, this.state, this.handleChange)}
            <DialogActions>
              <Button onClick={close} color="primary">
                Cancel
              </Button>
              <Button onClick={this.save} color="primary">
                Ok
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
}

const getFormForExchange = (exchange, state, handleChange) => {
  switch (exchange) {
    case 'bittrex':
      return (<div>
        <TextField
          label="API Key"
          id="apiKey"
          value={state.apiKey}
          onChange={handleChange('apiKey')}
          fullWidth
          margin="normal"
        />
        <TextField
          label="API Secret"
          id="apiSecret"
          value={state.apiSecret}
          onChange={handleChange('apiSecret')}
          fullWidth
          margin="normal"
        />
      </div>);
    case 'bitstamp':
      return (<div>
        <TextField
          label="Customer ID"
          id="customerId"
          value={state.customerId}
          onChange={handleChange('customerId')}
          fullWidth
          margin="normal"
        />
        <TextField
          label="API Key"
          id="apiKey"
          value={state.apiKey}
          onChange={handleChange('apiKey')}
          fullWidth
          margin="normal"
        />
        <TextField
          label="API Secret"
          id="apiSecret"
          value={state.apiSecret}
          onChange={handleChange('apiSecret')}
          fullWidth
          margin="normal"
        />
      </div>);
    default:
      return '';
  }
};
