const HYGRAPH_ENDPOINT = import.meta.env.HYGRAPH_ENDPOINT;
const HYGRAPH_TOKEN = import.meta.env.HYGRAPH_TOKEN;

if (!HYGRAPH_ENDPOINT) {
  throw new Error("Missing HYGRAPH_ENDPOINT environment variable");
}

type GraphQLResponse<T> = {
  data?: T;
  errors?: {
    message: string;
  }[];
};

export interface SiteSettings {
  siteName: string;
  siteUrl: string;
  siteTitle: string;
  siteDescription?: string;
  logo?: {
    url: string;
  };
  defaultOgImage?: {
    url: string;
  };
  phone?: string;
  email?: string;
  address?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  social?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    x?: string;
  };
}

export interface SiteMenu {
  items: {
    id: string;
    name: string;
    href: string;
    newTab: boolean;
  }[];
}

export async function hygraphFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const response = await fetch(HYGRAPH_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(HYGRAPH_TOKEN && {
        Authorization: `Bearer ${HYGRAPH_TOKEN}`,
      }),
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json: GraphQLResponse<T> = await response.json();

  if (json.errors?.length) {
    console.error(json.errors);
    throw new Error(json.errors[0].message);
  }

  if (!json.data) {
    throw new Error("No data returned from Hygraph");
  }

  return json.data;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const query = `
    query Site {
      site(where: { id: "cmp1jt8yv0cuu07nzoi396qca" }) {
        siteName
        siteUrl
        siteTitle
        siteDescription
        phone
        email
        address
        social {
          facebook
          instagram
          linkedin
          x
        }
        logo {
          url
        }
        defaultOgImage {
          url
        }
      }
    }
  `;

  const data = await hygraphFetch<{
    site: SiteSettings;
  }>(query);

  return data.site;
}

// Fetch Menu
export async function getSiteMenu(): Promise<SiteMenu> {
  const query = `
    query MyQuery {
      menu(where: {name: "Main"}) {
        items {
          ... on MenuItem {
            id
            name
            newTab
            href
          }
        }
      }
    }
  `;

  const data = await hygraphFetch<{
    menu: SiteMenu;
  }>(query);

  return data.menu;
}

// Google Analytics
// Configure via environment variable: PUBLIC_GOOGLE_ANALYTICS_ID
export const ANALYTICS = {
  google: import.meta.env.PUBLIC_GOOGLE_ANALYTICS_ID || 'G-XQPN2FZ83D',
}

// Umami Analytics
// Configure via environment variable: PUBLIC_UMAMI_WEBSITE_ID
export const UMAMI = {
  websiteId: import.meta.env.PUBLIC_UMAMI_WEBSITE_ID || '',
}