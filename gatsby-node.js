const path = require("path")
const {collections}  = require("./src/constants")

const { createFilePath } = require(`gatsby-source-filesystem`)

console.log("Allowing collections:")
console.log(collections)

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` })
    if (!(node.frontmatter.category in collections)) {
        throw new Error(`ValueError: The given category ${node.frontmatter.category} does not exist in the dictionary.`);
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
  const artworkDetailTemplate = path.resolve(`src/templates/artworkDetailPage.js`)
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    const slug = node.fields.slug
    const path = `${node.frontmatter.category}${slug}`
    console.log("Creating page: ", path)
    createPage({
      path: path,
      component: artworkDetailTemplate,
      context: {
        slug : slug,
        fullPath: path
      },
    })
  })  
  /*
  const artworkOverviewTemplate = path.resolve(`src/templates/artworkOverviewPage.js`)
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    console.log("Creating overview: ", node.fields.slug)
    createPage({
      path: `${node.frontmatter.category}`,
      component: artworkOverviewTemplate,
      context: {
        slug : node.fields.slug
      },
    })
  })  
  */
}