const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bittrex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { result: tickers } = await request('https://api.bittrex.com/api/v1.1/public/getmarketsummaries');

    return tickers.map((ticker) => {
    // Warning: Bittrex inverts base and quote!
      const [quote, base] = ticker.MarketName.split('-');

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.QuoteVolume),
        quoteVolume: parseToFloat(ticker.BaseVolume),
        high: parseToFloat(ticker.High),
        low: parseToFloat(ticker.Low),
        close: parseToFloat(ticker.Last),
      });
    });
  }
}

module.exports = Bittrex;
