export function unifySymbols(symbol: string): string {
  switch (symbol) {
    case 'XBT':
      return 'BTC';
    case 'XRB':
      return 'NANO';
    case 'ACT':
      return 'ACT*';
    default:
      return symbol;
  }
}
