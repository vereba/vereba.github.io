const {
  groupNodesByCategory,
  computeCategoryCounts,
  getPrimaryCategory,
  computePrevNextSlugs,
  computePaginationPages,
} = require("./gatsby-node-helpers")

function node(slug, title, category) {
  return { node: { fields: { slug }, frontmatter: { title, category } } }
}

describe("groupNodesByCategory", () => {
  const collectionKeys = ["all", "sketches", "postcards"]

  test("multi-category node is counted once in allCount but appears in both groups", () => {
    const edges = [node("/a/", "A", ["sketches", "postcards"])]
    const { categoryGroups, allCount } = groupNodesByCategory(edges, collectionKeys)
    expect(allCount).toBe(1)
    expect(categoryGroups.sketches).toEqual(["/a/"])
    expect(categoryGroups.postcards).toEqual(["/a/"])
  })

  test("normalizes a bare string category into a single-element group", () => {
    const edges = [node("/a/", "A", "sketches")]
    const { categoryGroups, allCount } = groupNodesByCategory(edges, collectionKeys)
    expect(allCount).toBe(1)
    expect(categoryGroups.sketches).toEqual(["/a/"])
  })

  test("excludes nodes with missing or empty title", () => {
    const edges = [node("/a/", undefined, "sketches"), node("/b/", "", "sketches")]
    const { categoryGroups, allCount } = groupNodesByCategory(edges, collectionKeys)
    expect(allCount).toBe(0)
    expect(categoryGroups).toEqual({})
  })

  test("excludes categories not in collectionKeys", () => {
    const edges = [node("/a/", "A", "news")]
    const { categoryGroups, allCount } = groupNodesByCategory(edges, collectionKeys)
    expect(allCount).toBe(0)
    expect(categoryGroups).toEqual({})
  })

  test("empty edges returns empty groups and zero count", () => {
    expect(groupNodesByCategory([], collectionKeys)).toEqual({ categoryGroups: {}, allCount: 0 })
  })

  test("preserves input order within a group", () => {
    const edges = [
      node("/a/", "A", "sketches"),
      node("/b/", "B", "sketches"),
      node("/c/", "C", "sketches"),
    ]
    const { categoryGroups } = groupNodesByCategory(edges, collectionKeys)
    expect(categoryGroups.sketches).toEqual(["/a/", "/b/", "/c/"])
  })
})

describe("computeCategoryCounts", () => {
  const collectionKeys = ["all", "sketches", "postcards"]

  test("all equals raw allCount, not the sum of group lengths", () => {
    const categoryGroups = { sketches: ["/a/", "/b/"], postcards: ["/a/"] }
    const counts = computeCategoryCounts(categoryGroups, 2, collectionKeys)
    expect(counts.all).toBe(2)
    expect(counts.sketches).toBe(2)
    expect(counts.postcards).toBe(1)
  })

  test("missing key defaults to 0", () => {
    const counts = computeCategoryCounts({}, 0, collectionKeys)
    expect(counts.sketches).toBe(0)
    expect(counts.postcards).toBe(0)
  })

  test("does not overwrite all via the collectionKeys loop", () => {
    const counts = computeCategoryCounts({ all: ["should be ignored"] }, 5, collectionKeys)
    expect(counts.all).toBe(5)
  })
})

describe("getPrimaryCategory", () => {
  test("returns the first element of an array category", () => {
    expect(getPrimaryCategory(["sketches", "postcards"])).toBe("sketches")
  })

  test("returns the first character of a bare string category (existing quirk)", () => {
    expect(getPrimaryCategory("sketches")).toBe("s")
  })

  test("returns undefined for undefined category", () => {
    expect(getPrimaryCategory(undefined)).toBeUndefined()
  })
})

describe("computePrevNextSlugs", () => {
  const categoryGroups = { sketches: ["/a/", "/b/", "/c/"] }

  test("middle element has both prev and next", () => {
    expect(computePrevNextSlugs(categoryGroups, "sketches", "/b/")).toEqual({
      prevSlug: "/a/",
      nextSlug: "/c/",
    })
  })

  test("first element has null prev", () => {
    expect(computePrevNextSlugs(categoryGroups, "sketches", "/a/")).toEqual({
      prevSlug: null,
      nextSlug: "/b/",
    })
  })

  test("last element has null next", () => {
    expect(computePrevNextSlugs(categoryGroups, "sketches", "/c/")).toEqual({
      prevSlug: "/b/",
      nextSlug: null,
    })
  })

  test("single-item group has both null", () => {
    expect(computePrevNextSlugs({ sketches: ["/a/"] }, "sketches", "/a/")).toEqual({
      prevSlug: null,
      nextSlug: null,
    })
  })

  test("slug not found in group has both null", () => {
    expect(computePrevNextSlugs(categoryGroups, "sketches", "/z/")).toEqual({
      prevSlug: null,
      nextSlug: null,
    })
  })

  test("unknown category has both null", () => {
    expect(computePrevNextSlugs(categoryGroups, "postcards", "/a/")).toEqual({
      prevSlug: null,
      nextSlug: null,
    })
  })
})

describe("computePaginationPages", () => {
  test("pagination disabled always yields a single page sized to numArtworks", () => {
    expect(
      computePaginationPages(7, { activatePagination: false, artworksPerRow: 3, artworkRowsPerPage: 2 })
    ).toEqual({ artworksPerPage: 7, numPages: 1 })
  })

  test("pagination disabled with zero artworks still yields artworksPerPage 1", () => {
    expect(
      computePaginationPages(0, { activatePagination: false, artworksPerRow: 3, artworkRowsPerPage: 2 })
    ).toEqual({ artworksPerPage: 1, numPages: 1 })
  })

  test("pagination enabled, evenly divisible count", () => {
    expect(
      computePaginationPages(12, { activatePagination: true, artworksPerRow: 3, artworkRowsPerPage: 2 })
    ).toEqual({ artworksPerPage: 6, numPages: 2 })
  })

  test("pagination enabled, non-evenly-divisible count rounds up", () => {
    expect(
      computePaginationPages(13, { activatePagination: true, artworksPerRow: 3, artworkRowsPerPage: 2 })
    ).toEqual({ artworksPerPage: 6, numPages: 3 })
  })

  test("pagination enabled with zero artworks yields numPages 1, not 0", () => {
    expect(
      computePaginationPages(0, { activatePagination: true, artworksPerRow: 3, artworkRowsPerPage: 2 })
    ).toEqual({ artworksPerPage: 6, numPages: 1 })
  })
})
