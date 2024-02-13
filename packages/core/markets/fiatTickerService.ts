import { Http, HttpClientFactory } from "@signumjs/http";
import { withError } from "../common/withError";

export interface MarketData {
  high_24h: number;
  low_24h: number;
  current_price: number;
  price_change_percentage_24h: number;
  last_updated: string;
}

interface FiatMarketData {
  ask: string;
  bid: string;
  code: string;
  codein: string;
  create_date: string;
  high: string;
  low: string;
  name: string;
  pctChange: string;
  timestamp: string;
}

export class FiatTickerService {
  private readonly httpClient: Http;

  constructor() {
    this.httpClient = HttpClientFactory.createHttpClient(
      "https://economia.awesomeapi.com.br/"
    );
  }

  public getUsdBrlMarket() {
    return withError<MarketData | null>(async () => {
      const { response } = await this.httpClient.get(`last/USD-BRL`);
      if (!response) return null;
      if (!response["USDBRL"]) return null;
      const data: FiatMarketData = response["USDBRL"];

      const convert = (vstr: string) => parseFloat(parseFloat(vstr).toFixed(4));

      return {
        current_price: convert(data.ask), // we take the higher value here
        high_24h: convert(data.high),
        low_24h: convert(data.low),
        last_updated: data.create_date,
        price_change_percentage_24h: convert(data.pctChange),
      };
    });
  }

  public getBrlUsdMarket() {
    return withError<MarketData | null>(async () => {
      const { response } = await this.httpClient.get(`last/BRL-USD`);
      if (!response) return null;
      if (!response["BRLUSD"]) return null;
      const data: FiatMarketData = response["BRLUSD"];

      const convert = (vstr: string) => parseFloat(parseFloat(vstr).toFixed(4));

      return {
        current_price: convert(data.ask), // we take the higher value here
        high_24h: convert(data.high),
        low_24h: convert(data.low),
        last_updated: data.create_date,
        price_change_percentage_24h: convert(data.pctChange),
      };
    });
  }
}
