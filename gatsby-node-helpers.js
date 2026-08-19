// Pure helpers used by createPages in gatsby-node.js (unit-tested in
// gatsby-node.test.js). Kept in a separate module because gatsby-node.js's
// exports are validated against Gatsby's known Node API list - exporting
// anything else there fails the build with API.NODE.VALIDATION.

function groupNodesByCategory(edges, collectionKeys) {
  const categoryGroups = {}
  let allCount = 0
  edges.forEach(({ node }) => {
    const hasTitle = node.frontmatter.title && node.frontmatter.title.length > 0
    if (!hasTitle) return
    const nodeCategories = (
      Array.isArray(node.frontmatter.category) ? node.frontmatter.category : [node.frontmatter.category]
    ).filter((category) => collectionKeys.includes(category))
    if (nodeCategories.length === 0) return
    allCount += 1
    nodeCategories.forEach((category) => {
      if (!categoryGroups[category]) categoryGroups[category] = []
      categoryGroups[category].push(node.fields.slug)
    })
  })
  return { categoryGroups, allCount }
}

function computeCategoryCounts(categoryGroups, allCount, collectionKeys) {
  const categoryCounts = { all: allCount }
  collectionKeys.forEach((key) => {
    if (key === "all") return
    categoryCounts[key] = (categoryGroups[key] || []).length
  })
  return categoryCounts
}

// NOTE: mirrors existing behavior exactly, including a pre-existing quirk —
// if frontmatter.category is ever a bare string rather than an array,
// `[0]` indexes into the string and returns its first CHARACTER, not the
// category. Not fixed here; pinned down by a regression test.
function getPrimaryCategory(frontmatterCategory) {
  return frontmatterCategory?.[0]
}

function computePrevNextSlugs(categoryGroups, category, slug) {
  const siblings = categoryGroups[category] || []
  const index = siblings.indexOf(slug)
  const prevSlug = index > 0 ? siblings[index - 1] : null
  const nextSlug = index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null
  return { prevSlug, nextSlug }
}

function computePaginationPages(numArtworks, { activatePagination, artworksPerRow, artworkRowsPerPage }) {
  const artworksPerPage = activatePagination ? artworkRowsPerPage * artworksPerRow : Math.max(numArtworks, 1)
  const numPages = activatePagination
    ? Math.ceil(numArtworks / artworksPerPage) > 0
      ? Math.ceil(numArtworks / artworksPerPage)
      : 1
    : 1
  return { artworksPerPage, numPages }
}

module.exports = {
  groupNodesByCategory,
  computeCategoryCounts,
  getPrimaryCategory,
  computePrevNextSlugs,
  computePaginationPages,
}
