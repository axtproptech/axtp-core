import { DescriptorData, DescriptorDataBuilder } from "@signumjs/standards";

export interface AssetAliasData {
  name: string;
  titleId: string;
  poolId: string;
  acquisitionStatus: number;
  acquisitionDate: Date;
  accumulatedCosts: number;
  estimatedMarketValue: number;
  acquisitionProgress: number;
  nextAlias?: string;
}

export class AssetAlias {
  private constructor(private d: DescriptorData) {}

  static parse(aliasURI: string) {
    return new AssetAlias(DescriptorData.parse(aliasURI));
  }

  getData(): AssetAliasData {
    const cx = (k: string) => this.d.getCustomField(k) as string;

    return {
      name: this.d.name,
      titleId: this.d.id,
      poolId: String(cx("x-pid")),
      acquisitionStatus: Number(cx("x-st") ?? 0),
      acquisitionDate: new Date(Number(cx("x-ad"))),
      accumulatedCosts: Number(cx("x-ac") ?? 0),
      estimatedMarketValue: Number(cx("x-mv") ?? 0),
      acquisitionProgress: Number(cx("x-pr") ?? 0),
      nextAlias: this.d.alias,
    };
  }

  getDescriptorData() {
    return this.d;
  }

  static create(data: AssetAliasData) {
    const builder = DescriptorDataBuilder.create(data.name)
      .setId(data.titleId)
      .setCustomField("x-pid", data.poolId)
      .setCustomField("x-st", String(data.acquisitionStatus))
      .setCustomField("x-ad", String(data.acquisitionDate.getTime()))
      .setCustomField("x-ac", String(data.accumulatedCosts))
      .setCustomField("x-mv", String(data.estimatedMarketValue))
      .setCustomField("x-pr", String(data.acquisitionProgress));

    if (data.nextAlias) {
      builder.setAlias(data.nextAlias);
    }

    return new AssetAlias(builder.build());
  }
}
