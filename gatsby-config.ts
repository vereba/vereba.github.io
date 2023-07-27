import type { GatsbyConfig } from "gatsby";

let env = process.env.NODE_ENV || "development";
console.log("Current env: ", env);
require("dotenv").config({
  path: `.env.${env}`,
});

const config: GatsbyConfig = {
  siteMetadata: {
    title: `vb-art`,
    siteUrl: `https://vb-art.gallery`,
    description: "Small gallery of the German artist Verena Barth",
    keywords: [
      "vb-art",
      "art",
      "gallery",
      "vbartbook",
      "artbook",
      "abstract",
      "city",
    ],
    author: "Verena Barth",
    lang: "en",
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
    "gatsby-plugin-sitemap",
    "gatsby-plugin-sharp",
    `gatsby-plugin-styled-components`,
    "gatsby-transformer-sharp",
    {
      resolve: `gatsby-omni-font-loader`,
      options: {
        enableListener: true,
        preconnect: [
          `https://fonts.googleapis.com`,
          `https://fonts.gstatic.com`,
        ],
        web: [
          {
            name: `Open Sans`,
            file: `https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap`,
          },
          {
            name: `Libre Baskerville`,
            file: `https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap`,
          },
        ],
      },
    },
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
  ],
};

export default config;
