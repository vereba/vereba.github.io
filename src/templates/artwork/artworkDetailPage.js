import React from "react"
import { graphql } from 'gatsby'
import { Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../../components/layout"
import {
  Container,
} from "react-bootstrap"
import { sizes } from "../../constants"
import { collections } from "../../constants"

import "../../styles/components/artworkDetail.scss"

export default function ArtworkDetailPage({ data }) {
  console.log("ArtworkDetailPage data: ", data)
  const artwork = data.markdownRemark
  const category = artwork.fields.slug.match(/[^/]+/)?.[0]
  console.log(category)
  const title = artwork.frontmatter.title || artwork.fields.slug
  let image = getImage(artwork.frontmatter.image?.childImageSharp?.gatsbyImageData)

  function convertSize(size) {
    try {
      return sizes[artwork.frontmatter.size]
    } catch (error) {
      console.error(error);
      return "-"
    }
  }

  return (
    <Layout pageInfo={{ pageName: `${artwork.frontmatter.category} - ${title}` }}>
      <Container fluid >
        <Container className="align-items-center tabs">
          <div className="breadcrumbs">
            <span>
              <Link to={`/artwork/${category}/`} className="link-no-style">Artwork</Link>
            </span>
            <span>></span>
            <span>
              <Link to={`/artwork/${category}/`} className="link-no-style">{collections[category]}</Link>
            </span>
            <span>></span>
            <span>
              <Link to={artwork.fields.slug} className="link-no-style">{title}</Link>
            </span>
          </div>

          <div className="artwork-container">
            <span id="category">{collections[category]}</span>
            <h1>{title}</h1>
            <GatsbyImage
              image={image}
              fluid={image}
              imgStyle={{ objectFit: "cover" }}
              alt={title}
            />

            <div className="information">
              <div>
                <span className="desc">Year</span>
                <span className="val">{artwork.frontmatter.date}</span>
              </div>
              <div>
                <span className="desc">Material</span>
                <span className="val"> {artwork.frontmatter.material}</span>
              </div>
              <div>
                <span className="desc">Size</span>
                <span className="val">{convertSize(artwork.frontmatter.size)}</span>
              </div>
            </div>
            <div
              className="artwork-detail-content"
              dangerouslySetInnerHTML={{ __html: artwork.html }}
            />
          </div>
        </Container>
      </Container>
    </Layout>
  )
}

export const pageQuery = graphql`
  query ArtworkDetailByPath($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      fields {
        slug
      }
      frontmatter {
        date
        title
        category
        material
        size
        image {
          childImageSharp {
              gatsbyImageData(height: 700)
          }
        }
      }
    }
  }
`