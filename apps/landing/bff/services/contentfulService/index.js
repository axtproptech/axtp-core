import { mapContentfulArticles } from "./mapContentfulArticles";
import { mapContentfulFAQs } from "./mapContentfulFAQs";

const CMSHostUrl = process.env.NEXT_SERVER_CMS_DELIVERY_HOST;
const AccessToken = process.env.NEXT_SERVER_CMS_ACCESS_TOKEN;

export class ContentService {
  #locale;
  constructor(locale = "pt-BR") {
    this.#locale = locale;
  }

  #l(url) {
    return `${url}&locale=${this.#locale}`;
  }

  async fetchRecentArticles() {
    const response = await fetch(
      this.#l(
        `${CMSHostUrl}/entries?content_type=posts&order=sys.createdAt&limit=10`
      ),
      {
        headers: {
          Authorization: `Bearer ${AccessToken}`,
        },
      }
    );
    const json = await response.json();
    return mapContentfulArticles(json);
  }

  async fetchSingleArticle(id) {
    const response = await fetch(
      this.#l(`${CMSHostUrl}/entries?sys.id=${id}`),
      {
        headers: {
          Authorization: `Bearer ${AccessToken}`,
        },
      }
    );
    const json = await response.json();
    const mapped = mapContentfulArticles(json);
    if (mapped.length) {
      return mapped[0];
    }
    return null;
  }

  async fetchExclusiveFAQs() {
    const response = await fetch(
      this.#l(
        `${CMSHostUrl}/entries?content_type=faq&metadata.tags.sys.id[in]=exclusive`
      ),
      {
        headers: {
          Authorization: `Bearer ${AccessToken}`,
        },
      }
    );
    const json = await response.json();
    return mapContentfulFAQs(json);
  }
}

export const contentService = new ContentService();
