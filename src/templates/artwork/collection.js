import React from 'react';
import { graphql } from "gatsby"
import {
  Container, Row
} from "react-bootstrap"
import { navigate } from 'gatsby'

import artworkImage from "../../assets/images/pageHeadings/artwork.jpg";
import PageMenu from '../../components/pageMenu';

import { collections } from "../../constants"

import Layout from "../../components/layout"
import PageHeading from "../../components/pageHeading"
import CollectionItem from "../../components/CollectionItem"


export default function Collection({ pageContext, data }) {

  const imagesPerRow = 3

  if (!data) return <h2>No items in this collection yet!</h2>
    const { edges: artworks } = data.allMarkdownRemark
    const grouped = artworks
      .filter(artwork => artwork.node.frontmatter.title.length > 0)
      .reduce(function (rows, key, index) {
        return (index % imagesPerRow == 0 ? rows.push([key])
          : rows[rows.length - 1].push(key)) && rows;
      }, [])

  function handleComponentChange(tab) {
    navigate(`/artwork/${tab}`)
  };



  return (
    <Layout pageInfo={{ pageName: "Artworks" }}>
      <PageHeading
        pageTitle={collections[pageContext.category]}
        pageImage={artworkImage}
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

                console.log("in map")
                console.log(nodes)
                const node1 = nodes[0]
                const node2 = (nodes.length > 1 ) ? nodes[1] : null;
                const node3 = (nodes.length > 1 ) ? nodes[2] : null;
                
                return (
                  <Row className="collectionRow">
                    <CollectionItem node={node1.node} />
                    {node2 ? <CollectionItem node={node2.node}/> : null}
                    {node3 ? <CollectionItem node={node3.node}/> : null}
                  </Row>


                )
              })
            }
          </Container>


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
