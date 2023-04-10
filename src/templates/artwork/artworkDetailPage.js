import React from "react"
import { graphql } from 'gatsby'
import { Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../../components/layout"
import {
  Container,
} from "react-bootstrap"
import { Breadcrumbs } from "../../components/breadcrumbs"


import "../../styles/components/artworkDetail.scss"

export default function ArtworkDetailPage({ data }) {
  console.log("ArtworkDetailPage data: ", data)
  const artwork = data.markdownRemark
  const title = artwork.frontmatter.title || artwork.fields.slug
  let image = getImage(artwork.frontmatter.image?.childImageSharp?.gatsbyImageData)
  return (
    <Layout pageInfo={{ pageName: `${artwork.frontmatter.category} - ${title}` }}>
      <Container fluid >
        <Container className="align-items-center tabs">
          <div className="breadcrumbs">
            <span>
              <Link to="/artwork" className="link-no-style">Artwork</Link>
            </span>
            <span>></span>
            <span>
              <Link to={`/artwork/${artwork.frontmatter.category}`} className="link-no-style">{artwork.frontmatter.category}</Link>
            </span>
            <span>></span>
            <span>
              <Link to={artwork.fields.slug} className="link-no-style">{title}</Link>
            </span>
          </div>

          <div className="artwork-container">
            <span>{artwork.frontmatter.category}</span>
            <h1>{title}</h1>
            <GatsbyImage
              image={image}
              fluid={image}
              imgStyle={{ objectFit: "cover" }}
              alt={title}
            />

            <div className="information">
              <div>
                <span class="desc">Year</span>
                <span class="val">{artwork.frontmatter.date}</span>
              </div>
              <div>
                <span class="desc">Material</span>
                <span class="val"> {artwork.frontmatter.material}</span>
              </div>
              <div>
                <span class="desc">Size</span>
                <span class="val">{artwork.frontmatter.size}</span>
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
              gatsbyImageData(width: 800)
          }
        }
      }
    }
  }
`