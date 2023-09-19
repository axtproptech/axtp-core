import { DescriptorData, DescriptorDataBuilder } from "@signumjs/standards";

export interface AssetAliasData {
  name: string;
  titleId: string;
  poolId: string;
  acquisitionStatus: number;
  acquisitionDate: Date;
  revenueStartDate: Date;
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

  isValid() {
    const has = (v: any) => v !== undefined;

    return (
      has(this.d.name) &&
      has(this.d.id) &&
      has(this.d.getCustomField("x-pid")) &&
      has(this.d.getCustomField("x-st")) &&
      has(this.d.getCustomField("x-ad")) &&
      has(this.d.getCustomField("x-rd")) &&
      has(this.d.getCustomField("x-ac")) &&
      has(this.d.getCustomField("x-mv")) &&
      has(this.d.getCustomField("x-pr"))
    );
  }
  getData(): AssetAliasData {
    const cx = (k: string) => this.d.getCustomField(k) as string;

    return {
      name: this.d.name,
      titleId: this.d.id,
      poolId: String(cx("x-pid")),
      acquisitionStatus: Number(cx("x-st") ?? 0),
      acquisitionDate: new Date(Number(cx("x-ad"))),
      revenueStartDate: new Date(Number(cx("x-rd"))),
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
      .setCustomField("x-rd", String(data.revenueStartDate.getTime()))
      .setCustomField("x-ac", String(data.accumulatedCosts))
      .setCustomField("x-mv", String(data.estimatedMarketValue))
      .setCustomField("x-pr", String(data.acquisitionProgress));

    if (data.nextAlias) {
      builder.setAlias(data.nextAlias);
    }

    return new AssetAlias(builder.build());
  }
}
