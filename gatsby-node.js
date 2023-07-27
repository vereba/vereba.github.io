const path = require("path")
const glob = require('glob');
const fs = require('fs');
const { createFilePath } = require(`gatsby-source-filesystem`)

const { collections, artworksPerRow, artworkRowsPerPage, newsPerPage } = require("./src/constants")

console.log("Allowing collections:")
console.log(collections)

// create slugs for MD files

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` })
    let categories = node.frontmatter.category
    if (!Array.isArray(categories)) {
      categories = [categories]
    }
    for (let c in node.frontmatter.category) {
      if (!c in collections) {
        throw new Error(`ValueError: The given category ${node.frontmatter.category} does not exist in the dictionary.`);
      }
    }
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}



exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  // create pages for md files
  const result = await graphql(`
    {
        allMarkdownRemark(sort: {frontmatter: {date: DESC}}) {
        edges {
          node {
            fields {
                slug
            }
            frontmatter {
              category
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }
  const newsDetailTemplate = path.resolve(`src/templates/artwork/newsDetailPage.js`)
  const artworkDetailTemplate = path.resolve(`src/templates/artwork/artworkDetailPage.js`)

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    const slug = node.fields.slug
    console.log("Slug: ", slug)
    var path = `artwork${slug}`
    var template = artworkDetailTemplate
    if (!Object.keys(collections).includes(node.frontmatter.category[0])) {
      // page is news
      path = `news${slug}`
      template = newsDetailTemplate
    }
    console.log("Creating page: ", path)
    // TODO uncomment: currently not creating news
    if (template != newsDetailTemplate) {
      createPage({
        path: path,
        component: template,
        context: {
          slug: slug,
          fullPath: path
        },
      })
    }

  })

  function createCollection(key, numArtworks) {
    console.log("creating collection: ", key)
    console.log("Number of artworks: ", numArtworks)
    const artworksPerPage = artworkRowsPerPage * artworksPerRow
    const numPages = Math.ceil(numArtworks / artworksPerPage) > 0 ? Math.ceil(numArtworks / artworksPerPage) : 1;
    console.log("Artworks per page: ", artworksPerPage, ", number of pages for collection '", key, "': ", numPages)

    // TODO which category
    // const category = key === "all"?
    Array.from({ length: numPages }).forEach((_, i) => {
      const pagePath = i === 0 ? `artwork/${key}` : `artwork/${key}/${i + 1}`
      createPage({
        path: pagePath,
        component: path.resolve("./src/templates/artwork/collection.js"),
        context: {
          limit: artworksPerPage,
          skip: i * artworksPerPage,
          category: key,
          numPages,
          currentPage: i + 1,
          filter: key === "all" ?
            { fileAbsolutePath: { regex: "/(artwork)/" } } :
            { frontmatter: { category: { in: [key] } } }
        },
      })
      console.log(`Page with path '${pagePath}' created`)
      if (key === "all") {
        console.log("Creating /artwork page for default collection: ", key)
        createPage({
          path: `artwork/`,
          component: path.resolve("./src/templates/artwork/collection.js"),
          context: {
            category: key,
            limit: artworksPerPage,
            skip: i * artworksPerPage,
            numPages,
            currentPage: i + 1,
            filter: { fileAbsolutePath: { regex: "/(artwork)/" } }
          },
        })
      }
    })
  }


  // create default collection "all"
  const allCollectionResult = await graphql(`
  {
    allMarkdownRemark(
      filter: {fileAbsolutePath: {regex: "/(artwork)/"}})
      {
      totalCount
    }
  }
  `)
  const numArtworksTotal = allCollectionResult.data.allMarkdownRemark.totalCount
  console.log("Check if all MD artwork files are considered.")
  glob(`./src/assets/artwork/mdfiles/**/*`, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    const fileCount = files.reduce((count, file) => {
      if (fs.statSync(file).isFile()) {
        return count + 1;
      }
      return count;
    }, 0);
    if (fileCount === numArtworksTotal) {
      console.log(`Number of markdown files is correct: ${numArtworksTotal}`);
    } else {
      console.error(`Expected ${numArtworksTotal} files, but found ${fileCount} files.`);
    }
  });


  createCollection("all", numArtworksTotal)

  // create collections
  for (const key in collections) {
    if (key !== "all") {
      console.log("Key: ", key)
      // get collection specific elements to count
      const collectionResult = await graphql(`
      {
        allMarkdownRemark(
          filter: {frontmatter: {category: {eq: "${key}"}}}) 
          {
          totalCount
        }
      }
      `)
      const numArtworks = collectionResult.data.allMarkdownRemark.totalCount
      createCollection(key, numArtworks)
    }

  }
}