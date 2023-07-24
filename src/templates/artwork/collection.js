import React, { useState, useEffect } from 'react';
import { Link, graphql } from "gatsby"
import {
  Container, Row
} from "react-bootstrap"
import { navigate } from 'gatsby'

import imageBw from "../../assets/artwork/images/black-and-white/coast.jpg";
import imageSketches from "../../assets/images/pageHeadings/artwork.jpg";
import imagePostcards from "../../assets/images/pageHeadings/artwork.jpg";
import imageTravel from "../../assets/images/pageHeadings/nyc2.jpg";
import imageDigital from "../../assets/images/pageHeadings/artwork.jpg";

import PageMenu from '../../components/pageMenu';

import { collections, artworksPerRow } from "../../constants"

import Layout from "../../components/layout"
import PageHeading from "../../components/pageHeading"
import CollectionItem from "../../components/CollectionItem"


export default function Collection({ pageContext, data }) {

  console.log(pageContext)
  console.log(data)
  if (!data) return <h2>No items in this collection yet!</h2>
  const { edges: artworks } = data.allMarkdownRemark
  console.log(artworks)


  const { currentPage, numPages } = pageContext
  const isFirst = currentPage === 1
  const isLast = currentPage === numPages
  const prevPage = currentPage - 1 === 1 ? `../` : (currentPage - 1).toString()
  const nextPage = (currentPage + 1).toString() //  `artwork/${pageContext.category}/${(currentPage + 1).toString()}`

  function getImageByCategory() {
    let image = imageBw;
    console.log("getImageByCategory")
    switch (pageContext.category) {
      case "sketches":
        image = imageSketches;
        break;
      case "travel":
        image = imageTravel;
        break;
      case "digital":
        image = imageDigital;
        break;
      case "postcards":
        image = imagePostcards;
        break;
    }
    return image
  }

  function getImagePosition() {
    let imagePosition = "center bottom";
    switch (pageContext.category) {
      case "black-and-white":
        imagePosition = "center center";
        break;
    }
    console.log("getImagePosition: ", imagePosition)
    return imagePosition
  }

  const grouped = artworks
    .filter(artwork => artwork.node.frontmatter.title.length > 0)
    .reduce(function (acc, value, index) {
      const subArrayIndex = Math.floor(index / artworksPerRow);
      if (!acc[subArrayIndex]) {
        acc[subArrayIndex] = [];
      }
      acc[subArrayIndex].push(value);
      return acc;
    }, [])

  function handleComponentChange(tab) {
    console.log("Handle change: ", tab)
    navigate(`/artwork/${tab}`)
  };

  return (
    <Layout pageInfo={{ pageName: "Artworks" }}>
      <PageHeading
        pageTitle={collections[pageContext.category]}
        pageImage={getImageByCategory()}
        backgroundPosition={getImagePosition()}
        titleInline={false}
      />
      <Container fluid >
        <Container className="align-items-center tabs">
          <PageMenu
            menuItems={collections}
            selectedItem={pageContext.category}
            onItemSelected={(tab) => handleComponentChange(tab)} />
          <Container className="collection">
            {
              grouped?.map((nodes) => {
                console.log(nodes)
                const node1 = nodes[0]
                const node2 = (nodes.length > 1) ? nodes[1] : null;
                const node3 = (nodes.length > 1) ? nodes[2] : null;
                console.log("Node 1:")
                console.log(node1)
                return (
                  <Row className="collectionRow">
                    <CollectionItem node={node1.node} />
                    {node2 ? <CollectionItem node={node2.node} /> : null}
                    {node3 ? <CollectionItem node={node3.node} /> : null}
                  </Row>
                )
              })
            }
          </Container>
          <div className="pagination">
            <ul>
              {!isFirst && (
                <Link to={prevPage} rel="prev">
                  ← Previous Page
                </Link>
              )}
              {Array.from({ length: numPages }, (_, i) => (
                <li
                  key={`pagination-number${i + 1}`}
                  style={{
                    margin: 0,
                  }}
                >
                  <Link
                    to={`/artwork/${pageContext.category}/${i === 0 ? '' : i + 1}`}
                    style={{
                      // padding: rhythm(1 / 4),
                      textDecoration: 'none',
                      color: i + 1 === currentPage ? '#818844' : '', //primary green
                      padding: "10px",
                      border: i + 1 === currentPage ? '1px solid #818844' : '',
                      //background: i + 1 === currentPage ? '#007acc' : '',
                    }}
                  >
                    {i + 1}
                  </Link>
                </li>
              ))}
              {!isLast && (
                <Link to={nextPage} rel="next">
                  Next Page →
                </Link>
              )}
            </ul>
          </div>

        </Container>
      </Container>
    </Layout>
  )
}


export const pageQuery = graphql`
query CollectionQuery($category: String,  $skip: Int!, $limit: Int!){
  allMarkdownRemark(
    filter: {frontmatter: {category: {in: [$category]}}}
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
