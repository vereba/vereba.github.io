import type { GatsbyConfig } from "gatsby";

let env = process.env.NODE_ENV || "development";
console.log("Current env: ", env);
require("dotenv").config({
  path: `.env.${env}`,
});

const siteUrl = `https://vb-art.com`;
const config: GatsbyConfig = {
  siteMetadata: {
    title: `vb-art`,
    siteUrl: siteUrl,
    description: "Small gallery of the German artist Verena Barth",
    keywords: [
      "vb-art",
      "art",
      "modern art",
      "artist",
      "black and white painting",
      "art",
      "gallery",
      "vbartbook",
      "artbook",
      "abstract art",
      "city",
    ],
    author: "Verena Barth",
    lang: "en",
    image: "/logo_green_full.png"
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  flags: {
    // DEV_SSR: true
  },
  plugins: [
    "gatsby-plugin-sass",
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    `gatsby-plugin-styled-components`,
    "gatsby-transformer-sharp",
    // generates sitemap under /sitemap-index.xml
    `gatsby-plugin-sitemap`,
    `gatsby-transformer-remark`,
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: `./src/assets/images/`,
      },
      __key: "images",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "artwork",
        path: `${__dirname}/src/assets/artwork/mdfiles/`,
      },
      __key: "artworkpage",
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/assets/artwork/images_watermarked/`,
      },
      __key: "artwork_watermarked",
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/assets/artwork/mockups/`,
      },
      __key: "artwork_mockups",
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/assets/artwork/images_low_res/`,
      },
      __key: "artwork_low_res",
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/assets/news/`,
      },
      __key: "news",
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/logo/logo_green_full.png",
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 700,
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `artworks`,
        path: `${__dirname}/src/assets/artwork/mdfiles/`,
      },
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: siteUrl,
        sitemap: `${siteUrl}/sitemap-index.xml`,
        env: {
          development: {
            policy: [{ userAgent: '*', disallow: ['/'] }]
          },
          production: {
            policy: [{ userAgent: '*', allow: '/' }]
          }
        }
      }
    }
  ],
};

export default config;
