import React, { useState, useEffect, useMemo } from "react"
import { Link, graphql } from "gatsby"
import { Container } from "react-bootstrap"

import PageMenu from "../../components/pageMenu"
import { collections, artworksPerRow } from "../../constants"
import Layout from "../../components/layout"
import CollectionItem from "../../components/collectionItem"

import "../../styles/components/collection.scss"

function getColumnCountForWidth(width) {
  if (width <= 640) return 2
  if (width <= 900) return 3
  return 4
}

function getAspectRatio(node) {
  const imageData = node.frontmatter.imagePreview?.childImageSharp?.gatsbyImageData
  if (!imageData?.width || !imageData?.height) return 1
  return imageData.height / imageData.width
}

// Assigns each artwork to whichever column is currently shortest, tallest
// images first (the "longest processing time" scheduling heuristic), so the
// grid's bottom edge ends up close to level regardless of image proportions.
function distributeIntoColumns(nodes, columnCount) {
  const columns = Array.from({ length: columnCount }, () => [])
  const columnHeights = new Array(columnCount).fill(0)
  const CAPTION_HEIGHT = 0.12 // fudge factor (relative to column width) for caption + gap

  nodes.forEach((node) => {
    let shortest = 0
    for (let i = 1; i < columnCount; i++) {
      if (columnHeights[i] < columnHeights[shortest]) shortest = i
    }
    columns[shortest].push(node)
    columnHeights[shortest] += getAspectRatio(node) + CAPTION_HEIGHT
  })

  return columns
}

export default function Collection({ pageContext, data }) {
  const [columnCount, setColumnCount] = useState(artworksPerRow)

  useEffect(() => {
    const updateColumnCount = () => setColumnCount(getColumnCountForWidth(window.innerWidth))
    updateColumnCount()

    let resizeTimeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(updateColumnCount, 150)
    }
    window.addEventListener("resize", handleResize)
    return () => {
      clearTimeout(resizeTimeout)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const artworks = data?.allMarkdownRemark?.edges ?? []
  const { currentPage, numPages } = pageContext
  const isLast = currentPage === numPages
  const nextPage = (currentPage + 1).toString()

  const filteredArtworks = artworks
    .filter((artwork) =>
      pageContext.category === "all"
        ? true
        : artwork.node.frontmatter.category.includes(pageContext.category)
    )
    .filter((artwork) => artwork.node.frontmatter.title.length > 0)

  const columns = useMemo(
    () =>
      distributeIntoColumns(
        filteredArtworks.map((artwork) => artwork.node),
        columnCount
      ),
    [filteredArtworks, columnCount]
  )

  if (!data) return <h2>No items in this collection yet!</h2>

  return (
    <Layout pageInfo={{ pageName: "Artwork" }}>
      <Container className="page-header">
        <div className="page-title">Artwork</div>
        <PageMenu
          menuItems={collections}
          selectedItem={pageContext.category}
          counts={pageContext.categoryCounts}
        />
        <h1 className="category-title">{collections[pageContext.category]}</h1>
      </Container>

      {!filteredArtworks || filteredArtworks.length === 0 ? (
        <p className="noPictures">No pictures uploaded (yet)</p>
      ) : (
        <Container className="artwork-masonry">
          {columns.map((column, columnIndex) => (
            <div className="artwork-masonry-column" key={columnIndex}>
              {column.map((node, index) => (
                <CollectionItem key={index} node={node} />
              ))}
            </div>
          ))}
        </Container>
      )}

      {numPages > 1 && (
        <Container className="pagination">
          {Array.from({ length: numPages }, (_, i) => (
            <Link
              key={`pagination-number${i + 1}`}
              to={`/artwork/${pageContext.category}/${i === 0 ? "" : i + 1}`}
              className={i + 1 === currentPage ? "current" : ""}
            >
              {i + 1}
            </Link>
          ))}
          {!isLast && (
            <Link to={`/artwork/${pageContext.category}/${nextPage}`} rel="next">
              Next page →
            </Link>
          )}
        </Container>
      )}
    </Layout>
  )
}

export const pageQuery = graphql`
  query CollectionQuery($skip: Int!, $limit: Int!, $filter: MarkdownRemarkFilterInput!) {
    allMarkdownRemark(
      filter: $filter
      sort: { frontmatter: { date: DESC } }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            date
            title
            category
            material
            size
            sold
            imagePreview {
              childImageSharp {
                gatsbyImageData(width: 400, transformOptions: { cropFocus: CENTER })
              }
            }
            image {
              childImageSharp {
                gatsbyImageData(width: 800, transformOptions: { cropFocus: CENTER })
              }
            }
          }
        }
      }
    }
  }
`
