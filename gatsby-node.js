const path = require("path")
const { collections } = require("./src/constants")

const { createFilePath } = require(`gatsby-source-filesystem`)

console.log("Allowing collections:")
console.log(collections)

// create slugs for MD files

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` })
    let categories = node.frontmatter.category
    if(!Array.isArray(categories)){
      categories = [categories]
    }
    for(let c in node.frontmatter.category){
      if(!c in collections) {
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
  const { createPage, createRedirect } = actions

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
  const artworkDetailTemplate = path.resolve(`src/templates/artwork/artworkDetailPage.js`)
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    const slug = node.fields.slug
    const path = `artwork/${node.frontmatter.category}${slug}`
    console.log("Creating page: ", path)
    createPage({
      path: path,
      component: artworkDetailTemplate,
      context: {
        slug: slug,
        fullPath: path
      },
    })
  })

  // create collections
  for (const key in collections) {
    console.log("creating collection: ", key)
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
    console.log("Numer of artworks: ", numArtworks)
    const artworksPerPage = 6
    const numPages = Math.ceil(numArtworks / artworksPerPage) > 0? Math.ceil(numArtworks / artworksPerPage) : 1;
    Array.from({ length: numPages }).forEach((_, i) => {
      const pagePath = i === 0 ? `artwork/${key}` : `artwork/${key}/${i + 1}`
      createPage({
        path: pagePath,
        component: path.resolve("./src/templates/artwork/collection.js"),
        context: {
          category: key,
          limit: artworksPerPage,
          skip: i * artworksPerPage,
          category: key,
          numPages,
          currentPage: i + 1,
        },
      })
      console.log(`Page with path '${pagePath}' created`)
    })
  }

  createRedirect({
    fromPath: `/artwork/`,
    toPath: `/artwork/black-and-white-painting`,
  })

  

}


