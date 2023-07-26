import React from "react"
import { graphql } from 'gatsby'
import { Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../../components/layout"
import {
  Col,
  Container, Row,
} from "react-bootstrap"
import { sizes } from "../../constants"
import { collections } from "../../constants"

import "../../styles/components/artworkDetail.scss"

export default function ArtworkDetailPage({ data }) {
  console.log("ArtworkDetailPage data: ", data)
  const artwork = data.markdownRemark
  const category = artwork.fields.slug.match(/[^/]+/)?.[0]
  const title = artwork.frontmatter.title || artwork.fields.slug
  let image = getImage(artwork.frontmatter.image?.childImageSharp?.gatsbyImageData)

  function convertSize(size) {
    const convertedSize = sizes[artwork.frontmatter.size]
    if (convertedSize) {
      return convertedSize
    }
    return size
  }

  return (
    <Layout pageInfo={{ pageName: `artwork` }}>
      <Container fluid >
      <Container className="breadcrumbs">
            <span>
              <Link to={`/artwork/${category}/`} className="link-no-style">Artwork</Link>
            </span>
            <span>></span>
            <span>
              <Link to={`/artwork/${category}/`} className="link-no-style">{collections[category]}</Link>
            </span>
            <span>></span>
            <span>
              <Link to={`/artwork${artwork.fields.slug}`} className="link-no-style">{title}</Link>
            </span>
          </Container>
        <Container className="align-items-center tabs">
          <div className="artwork-container">
            <span class="category">{collections[category]}</span>
            <h1>{title}</h1>
            <GatsbyImage
              image={image}
              fluid={image}
              imgStyle={{ objectFit: "cover" }}
              alt={title}
            />
            <Row className="information">
              <Col className="col-12 col-md-3">
              <span className="desc">Year</span>
                <span className="val">{artwork.frontmatter.date}</span>
              </Col>
              <Col className="col-12 col-md-3">
              <span className="desc">Material</span>
                <span className="val"> {artwork.frontmatter.material}</span>
               </Col>
              <Col className="col-12 col-md-3">
              <span className="desc">Size</span>
                <span className="val">{convertSize(artwork.frontmatter.size)}</span>
               </Col>
            </Row>
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