// Mapped FAQ Data
//
// const article = {
//   id: "",
//   createdAt: "",
//   tags: [],
//   content: {
//     question: " Greetings, my fellow earthlings!",
//     answer: "The idea of owning a unicorn 🦄",
//   },
// };
//

/**
 * @typedef FAQContent
 * @type {object}
 * @property {string} question
 * @property {string} answer
 */

/**
 * @typedef FAQ
 * @type {object}
 * @property {string} id - an ID.
 * @property {string} createdAt - Creation Date.
 * @property {string[]} tags - Tags.
 * @property {FAQContent} content - your age.
 */

/**
 *
 * @param rawFAQs
 * @return {FAQ[]}
 */
export function mapContentfulFAQs(rawFAQs) {
  const faqs = [];
  for (let r of rawFAQs.items) {
    let a = {
      id: r.sys.id,
      createdAt: r.sys.createdAt,
      tags: r.metadata.tags.map((t) => t.sys.id),
      content: { ...r.fields },
    };
    faqs.push(a);
  }
  return faqs;
}
