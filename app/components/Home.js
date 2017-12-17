// @flow
import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import { Table, TableBody, TableCell, TableHead, TableRow } from 'material-ui';
import TransactionRow from './TransactionRow';
import Portfolio from './Portfolio';

type Props = {
  transactions: any
};

export default class Home extends Component<Props> {

  render() {
    const transactions = flattenTransactions(this.props.transactions);

    return (
      <div className="container">
        <Portfolio transactions={transactions}/>
        <Paper style={{ marginTop: 30, paddingTop: 10 }}>
          <h1 style={{ paddingLeft: 10 }}>Transactions</h1>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Market / Currency</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map(transaction => (
                <TransactionRow key={transaction.id} transaction={transaction}/>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}

function flattenTransactions(transactions) {
  let flattenedTransactions = [];
  Object.keys(transactions)
    .forEach(sourceName => {
      flattenedTransactions = flattenedTransactions
        .concat(transactions[sourceName].trades).concat(transactions[sourceName].transfers);
    });
  flattenedTransactions.sort((a, b) => b.date - a.date);
  return flattenedTransactions;
}
