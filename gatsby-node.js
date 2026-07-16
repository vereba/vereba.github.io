const path = require("path")
const glob = require("glob")
const fs = require("fs")
const { createFilePath } = require(`gatsby-source-filesystem`)

const {
  collections,
  artworksPerRow,
  artworkRowsPerPage,
  newsPerPage,
  activatePagination,
  ARTWORK_PATH_REGEX,
} = require("./src/constants")

// create slugs for MD files

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` })
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
      allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
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

  // Group artwork slugs by their frontmatter category (not the folder the MD
  // file happens to live in — those can diverge), in the same DESC-by-date
  // order used to build the collection grids, so prev/next navigation on the
  // detail page matches gallery browsing order. A piece can list more than
  // one category (e.g. a sketch that's also sold as a postcard), so it's
  // grouped under every category it declares, not just the first.
  const categoryGroups = {}
  let allCount = 0
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    const hasTitle = node.frontmatter.title && node.frontmatter.title.length > 0
    if (!hasTitle) {
      return
    }
    const nodeCategories = (
      Array.isArray(node.frontmatter.category)
        ? node.frontmatter.category
        : [node.frontmatter.category]
    ).filter((category) => Object.keys(collections).includes(category))
    if (nodeCategories.length === 0) {
      return
    }
    allCount += 1
    nodeCategories.forEach((category) => {
      if (!categoryGroups[category]) {
        categoryGroups[category] = []
      }
      categoryGroups[category].push(node.fields.slug)
    })
  })

  // Counts shown in the category tabs on the gallery pages, kept in sync
  // with the same title-filtered set actually rendered in each grid. "all"
  // is the unique file count, not a sum, so multi-category pieces aren't
  // double-counted.
  const categoryCounts = { all: allCount }
  Object.keys(collections).forEach((key) => {
    if (key === "all") return
    categoryCounts[key] = (categoryGroups[key] || []).length
  })

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    const category = node.frontmatter.category?.[0]
    if (!Object.keys(collections).includes(category)) {
      // No template renders non-artwork content (legacy "news" pages are
      // gone), so nodes outside the known categories are skipped.
      return
    }
    const slug = node.fields.slug
    const pagePath = `artwork${slug}`
    const siblings = categoryGroups[category] || []
    const index = siblings.indexOf(slug)
    const prevSlug = index > 0 ? siblings[index - 1] : null
    const nextSlug = index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null
    createPage({
      path: pagePath,
      component: artworkDetailTemplate,
      context: {
        slug: slug,
        fullPath: pagePath,
        prevSlug: prevSlug,
        nextSlug: nextSlug,
      },
    })
  })

  function createCollection(key, numArtworks) {
    const paginate = activatePagination
    const artworksPerPage = paginate
      ? artworkRowsPerPage * artworksPerRow
      : Math.max(numArtworks, 1)
    const numPages = paginate
      ? Math.ceil(numArtworks / artworksPerPage) > 0
        ? Math.ceil(numArtworks / artworksPerPage)
        : 1
      : 1
    reporter.info(`Creating collection '${key}': ${numArtworks} artwork(s), ${numPages} page(s)`)

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
          categoryCounts,
          filter:
            key === "all"
              ? { fileAbsolutePath: { regex: ARTWORK_PATH_REGEX } }
              : { frontmatter: { category: { in: [key] } } },
        },
      })
      if (key === "all") {
        createPage({
          path: `artwork/`,
          component: path.resolve("./src/templates/artwork/collection.js"),
          context: {
            category: key,
            limit: artworksPerPage,
            skip: i * artworksPerPage,
            numPages,
            currentPage: i + 1,
            categoryCounts,
            filter: { fileAbsolutePath: { regex: ARTWORK_PATH_REGEX } },
          },
        })
      }
    })
  }

  // create default collection "all"
  const allCollectionResult = await graphql(`
  {
    allMarkdownRemark(
      filter: {fileAbsolutePath: {regex: "${ARTWORK_PATH_REGEX}"}})
      {
      totalCount
    }
  }
  `)
  const numArtworksTotal = allCollectionResult.data.allMarkdownRemark.totalCount
  glob(`./src/assets/artwork/mdfiles/**/*`, (err, files) => {
    if (err) {
      reporter.error("Error while globbing artwork markdown files", err)
      return
    }

    const fileCount = files.reduce((count, file) => {
      if (fs.statSync(file).isFile()) {
        return count + 1
      }
      return count
    }, 0)
    if (fileCount !== numArtworksTotal) {
      reporter.warn(`Expected ${numArtworksTotal} artwork markdown files, but found ${fileCount}.`)
    }
  })

  createCollection("all", numArtworksTotal)

  // create collections
  for (const key in collections) {
    if (key !== "all") {
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
