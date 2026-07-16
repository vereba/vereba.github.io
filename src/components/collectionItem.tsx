import React from "react"
import { Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

export default function CollectionItem({ node }) {
  const title = node.frontmatter.title || node.fields.slug
  const image = getImage(node.frontmatter.imagePreview?.childImageSharp?.gatsbyImageData)

  return (
    <Link to={`/artwork${node.fields.slug}`} className="artwork-card">
      <div className="artwork-thumb">
        <GatsbyImage image={image} alt={title} />
        {node.frontmatter.sold ? (
          <span className="status-badge">{node.frontmatter.sold}</span>
        ) : null}
      </div>
    </Link>
  )
}
