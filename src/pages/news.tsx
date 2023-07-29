import React from "react"
import { GatsbyImage, StaticImage } from "gatsby-plugin-image"
import { StaticQuery, graphql } from "gatsby"

import { Row, Col, Container } from "react-bootstrap"
import { Link } from "gatsby"
import Layout from "../components/layout"

import PageHeading from "../components/pageHeading"



import aboutImage from "../assets/images/pageHeadings/about.jpg";


const NewsPreview = ({ article }) => (
  <Link to={`/news/${article.slug}`} className="link-no-style">
    <Row className="newsPreview">
      <Col md="3">
        {article.title_image ? (
          <img src= "../../assets/artwork/images_watermarked/black-and-white/coast.jpg"//{article.title_image}
          alt={article.title}
        />

        ) : (
          <p>No image: {JSON.stringify(article)}</p>
        )}
      </Col>
      <Col md="9" sm="12">
        <span className="articleCategory">{article.category}</span>
        <h3>{article.title}</h3>
        <span className="articleDate">{article.date}</span>
        <div
          className="previewText"
          dangerouslySetInnerHTML={{ __html: article.html }}
        />
      </Col>
    </Row>
  </Link>
)

const NewsPage = () => (
  <StaticQuery
    query={graphql`
    query GetNewsQuery {
      allMarkdownRemark(
        filter: {fileAbsolutePath: {regex: "/news/"}}
        sort: {frontmatter: {id: ASC}}
      ) {
        nodes {
          frontmatter {
            id
            date
            title
            category
            title_image
          }
          html
        }
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
    `}
    render={data => (
      <Layout pageInfo={{ pageName: "News" }}>
        <PageHeading pageTitle={`News`} pageImage={aboutImage} />
        <Container fluid>
          <Container className="content" id="news">
            {data.allMarkdownRemark.nodes.map(node => (
              <NewsPreview key={node.frontmatter.id} article={node.frontmatter} />
            ))}
          </Container>
        </Container>
      </Layout>
    )}
  />
)

export default NewsPage
