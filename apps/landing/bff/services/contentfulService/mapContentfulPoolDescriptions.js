// Mapped Data
//
// const poolDescription = {
//   id: "",
//   createdAt: "",
//   tags: [],
//   content: {
//     poolId: "21423532532455",
//     icon: "url"
//     name: "TAXTP001"
//     description:
//       "The article discusses the challenges of owning a pet unicorn, from their messy and demanding nature to their unpredictable mood swings and the potential hazards posed by their horn. While the idea of owning a unicorn may seem appealing, the reality is far from glamorous. The article concludes by suggesting that it may be better to stick with more conventional pets, such as goldfish or hamsters.",
//   },
// };
//

import { resolveContentfulReference } from "bff/services/contentfulService/resolveContentfulReference";

export function mapContentfulPoolDescriptions(rawDescriptions) {
  const poolDescriptions = [];
  for (let r of rawDescriptions.items) {
    let a = {
      id: r.sys.id,
      createdAt: r.sys.createdAt,
      tags: r.metadata.tags.map((t) => t.sys.id),
      content: { ...r.fields },
    };

    // resolve references and overwrite data
    const imageData = resolveContentfulReference(
      rawDescriptions.includes,
      a.content.icon.sys
    );

    a.content.icon = imageData ? `https:${imageData.file.url}` : "";

    poolDescriptions.push(a);
  }
  return poolDescriptions;
}
