import { Link, graphql } from "gatsby"
import {
  Container,Row, Col
} from "react-bootstrap"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { navigate } from 'gatsby'

import artworkImage from "../../assets/images/pageHeadings/artwork.jpg";
import PageMenu from '../../components/pageMenu';

import {collections} from "../../constants"
import React, { useState } from 'react';
import Layout from "../../components/layout"
import PageHeading from "../../components/pageHeading"


export default function Collection({pageContext, data}) {
  console.log(pageContext)

  const { edges: artworks } = data.allMarkdownRemark
  if (!data) return <h2>No items in this collection yet!</h2>

  function handleComponentChange(tab) {
    navigate(`/artwork/${tab}`)
  };

  return (
    <Layout pageInfo={{ pageName: "Artworks" }}>
    <PageHeading
      pageTitle={collections[pageContext.category]}
      pageImage={artworkImage}
    />
    <Container fluid >
      <Container className="align-items-center tabs">
        <PageMenu
          menuItems={collections}
          selectedItem={pageContext.category}
          onItemSelected={(tab) => handleComponentChange(tab)} />
        <Row>
          <Col>
      <Container className="collection">
        {artworks
        .filter(artwork => artwork.node.frontmatter.title.length > 0)
        .map(({ node }) => {
          console.log(node)
          const title = node.frontmatter.title || node.fields.slug
          let image = getImage(node.frontmatter.image?.childImageSharp?.gatsbyImageData) // .images.sources[0]
          return (
            <div className="collectionItem" key={title}>
            <GatsbyImage
              image={image}
              fluid={image}
              imgStyle={{ objectFit: "cover" }}
              alt={title}
            />
            <div>{title}</div>
        </div>
          )
        })}
      </Container>
      </Col>
            </Row>
          </Container>
          <div className="success-line" />
        </Container>
        <Container fluid style={{ marginTop: "-2.5rem" }}>
          <PageHeading pageTitle={"Other recommended XAI methods"} />
        </Container>

      </Layout>
  )
}


export const pageQuery = graphql`
query CollectionQuery($category: String, $skip: Int!, $limit: Int!){
  allMarkdownRemark(
    filter: {frontmatter: {category: {eq: $category}}}
    sort: { frontmatter: { date: DESC }}
      limit: $limit
      skip: $skip
    ) {
    nodes {
      frontmatter {
        date
        title
      }
    }
    edges {
      node {
        fields {
          slug
        }
        frontmatter {
          date
          title
          category
          image {
            childImageSharp {
                gatsbyImageData(width: 400)
            }
          }
        }
      }
    }
  }
}
`
