import type { GatsbyConfig } from "gatsby";

let env = process.env.NODE_ENV || 'development';
console.log("Current env: ", env)
require("dotenv").config({
  path: `.env.${env}`,
})

const config: GatsbyConfig = {
  siteMetadata: {
    title: `vbartbook`,
    siteUrl: `https://vbartbook.com`,
    description: "TODO",
    keywords:[ "art", "gallery", "vbartbook", "artbook"],
    author: "Verena Barth"
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  flags:  {
    // DEV_SSR: true
  },
  plugins: ["gatsby-plugin-sass",
    "gatsby-plugin-google-gtag",
    "gatsby-plugin-image", 
    "gatsby-plugin-sitemap", 
    "gatsby-plugin-sharp", 
    "gatsby-transformer-sharp", 
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        "name": "images",
        "path": `./src/assets/images/`
      },
      __key: "images"
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "artwork",
        path: `${__dirname}/src/assets/artwork/mdfiles/`,
      },
      __key: "artworkpage"
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/assets/artwork/images/`,
      },
      __key: "artwork"
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/assets/news/`,
      },
      __key: "news"
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: 'src/images/logo/logo_green_full.png',
      },
    },
    "gatsby-transformer-remark",
  ]
};

export default config;
