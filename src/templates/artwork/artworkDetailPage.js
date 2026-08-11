import React, { useState } from "react"
import { graphql } from "gatsby"
import { Link } from "gatsby"
import { getImage, getSrc } from "gatsby-plugin-image"
import Layout from "../../components/layout"
import ImageMagnifier from "../../components/imageMagnifier"
import ContactForm from "../../components/contactForm"
import { Button, Container } from "react-bootstrap"
import Carousel from "react-bootstrap/Carousel"
import { sizes } from "../../constants"
import { collections } from "../../constants"

import "../../styles/components/artworkDetail.scss"

export default function ArtworkDetailPage({ data }) {
  const artwork = data.markdownRemark
  const prevArtwork = data.prevArtwork
  const nextArtwork = data.nextArtwork
  const category = artwork.frontmatter.category?.[0]
  const title = artwork.frontmatter.title || artwork.fields.slug
  const isSold = Boolean(artwork.frontmatter.sold)
  const [showInquireForm, setShowInquireForm] = useState(false)
  let image = getImage(artwork.frontmatter.image?.childImageSharp?.gatsbyImageData)
  const imageZoomSrc = getSrc(artwork.frontmatter.image?.childImageSharp?.zoomImageData)
  let imageList = null
  if (artwork.frontmatter.otherImages) {
    imageList = [{ image, zoomSrc: imageZoomSrc }]
    artwork.frontmatter.otherImages.forEach((elem, index) => {
      imageList.push({
        image: elem.childImageSharp?.gatsbyImageData,
        zoomSrc: getSrc(elem.childImageSharp?.zoomImageData),
      })
    })
  }

  function convertSize(size) {
    const convertedSize = sizes[artwork.frontmatter.size]
    if (convertedSize) {
      return convertedSize
    }
    return size
  }


  return (
    <Layout pageInfo={{ pageName: `artwork` }}>
      <Container fluid>
        <Container className="breadcrumbs">
          <span>
            <Link to={`/artwork/${category}/`} className="link-no-style">
              Artwork
            </Link>
          </span>
          <span>/</span>
          <span>
            <Link to={`/artwork/${category}/`} className="link-no-style">
              {collections[category]}
            </Link>
          </span>
          <span>/</span>
          <span className="current">{title}</span>
        </Container>
        <Container className="tabs">
          <div className="artwork-container">
            <div className="artwork-detail-layout">
              <div className="artwork-header">
                <span className="category">{collections[category]}</span>
                <h1>{title}</h1>

                <span className={`badge ${isSold ? "badge-sold" : "badge-available"}`}>
                  {!isSold && <span className="dot"></span>}
                  {isSold ? artwork.frontmatter.sold : "Available"}
                </span>
              </div>
              <div className="artwork-media">
                <div className="artwork-image-wrap">
                  {imageList ? (
                    <Carousel className="d-block" interval={10000}>
                      {imageList?.map((item, index) => (
                        <Carousel.Item key={index}>
                          <ImageMagnifier
                            image={item.image}
                            zoomSrc={item.zoomSrc}
                            alt={`${title} ${index}`}
                            imgStyle={{ objectFit: "cover" }}
                          />
                          <p className="sliderSubtitle">
                            {title} {index === 0 ? "" : index}
                          </p>
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  ) : (
                    <ImageMagnifier
                      image={image}
                      zoomSrc={imageZoomSrc}
                      imgStyle={{ objectFit: "cover" }}
                      alt={title}
                    />
                  )}
                </div>
                <div className="image-meta-row">
                  <span>© Verena Barth, {artwork.frontmatter.date}</span>
                </div>
              </div>
              <div className="artwork-details">
                {!isSold && (
                  <>
                    <div className="price">Price on request</div>
                    <div className="actions">
                      <Button
                        type="button"
                        onClick={() => setShowInquireForm((show) => !show)}
                        variant="outline-secondary"
                      >
                        Inquire
                      </Button>
                    </div>
                    {showInquireForm && (
                      <div className="inquire-form-wrap">
                        <ContactForm artworkTitle={title} />
                      </div>
                    )}
                  </>
                )}

                <div className="meta-table">
                  <div className="meta-row">
                    <span className="label">Year</span>
                    <span className="value">{artwork.frontmatter.date}</span>
                  </div>
                  <div className="meta-row">
                    <span className="label">Material</span>
                    <span className="value">{artwork.frontmatter.material}</span>
                  </div>
                  <div className="meta-row">
                    <span className="label">Size</span>
                    <span className="value">{convertSize(artwork.frontmatter.size)}</span>
                  </div>
                </div>

                <div className="trust-notes">
                  <div className="note">
                    <span aria-hidden="true">🛡</span> Certificate of authenticity included
                  </div>
                  {/*
                                    <div className="note">
                    <span aria-hidden="true">📦</span> Insured shipping, ships in 10-14 days
                  </div>
                  */}
                </div>
              </div>
            </div>
            <div
              className="artwork-detail-content"
              dangerouslySetInnerHTML={{ __html: artwork.html }}
            />
          </div>
        </Container>
        {(prevArtwork || nextArtwork) && (
          <Container className="artwork-pagination">
            {prevArtwork ? (
              <Link to={`/artwork${prevArtwork.fields.slug}`} className="link-no-style">
                ← {prevArtwork.frontmatter.title}
              </Link>
            ) : (
              <span></span>
            )}
            {nextArtwork ? (
              <Link to={`/artwork${nextArtwork.fields.slug}`} className="link-no-style">
                {nextArtwork.frontmatter.title} →
              </Link>
            ) : (
              <span></span>
            )}
          </Container>
        )}
      </Container>
    </Layout>
  )
}

export const pageQuery = graphql`
  query ArtworkDetailByPath($slug: String!, $prevSlug: String, $nextSlug: String) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      fields {
        slug
      }
      html
      frontmatter {
        date
        title
        category
        material
        size
        sold
        image {
          childImageSharp {
            gatsbyImageData(height: 600, transformOptions: { cropFocus: CENTER })
            zoomImageData: gatsbyImageData(width: 1900, quality: 85, layout: FIXED, placeholder: NONE, transformOptions: { cropFocus: CENTER })
          }
        }
        otherImages {
          childImageSharp {
            gatsbyImageData(height: 600, transformOptions: { cropFocus: CENTER })
            zoomImageData: gatsbyImageData(width: 1900, quality: 100, layout: FIXED, placeholder: NONE, transformOptions: { cropFocus: CENTER })
          }
        }
      }
    }
    prevArtwork: markdownRemark(fields: { slug: { eq: $prevSlug } }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    nextArtwork: markdownRemark(fields: { slug: { eq: $nextSlug } }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`
