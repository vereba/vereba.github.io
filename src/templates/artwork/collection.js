import React from 'react';
import { Link, graphql } from "gatsby"
import {
  Container, Row
} from "react-bootstrap"
import { navigate } from 'gatsby'

import PageMenu from '../../components/pageMenu';
import { collections, artworksPerRow } from "../../constants"
import Layout from "../../components/layout"
import PageHeading from "../../components/pageHeading"
import CollectionItem from "../../components/collectionItem"

import imageAll from "../../assets/images/pageHeadings/midnight_city.jpg";
// import imageAll from "../../assets/images/pageHeadings/dog.jpg";
import imageBw from "../../assets/images/pageHeadings/wide_white_street.jpg";
import imageSketches from "../../assets/images/pageHeadings/artwork.jpg";
import imagePostcards from "../../assets/images/pageHeadings/artwork.jpg";
import imageTravel from "../../assets/images/pageHeadings/about.jpg"; //formerly nyc2
import imageDigital from "../../assets/images/pageHeadings/artwork.jpg";
import imageColorful from "../../assets/images/pageHeadings/favela_glow.jpg";



export default function Collection({ pageContext, data }) {

  if (!data) return <h2>No items in this collection yet!</h2>

  const { edges: artworks } = data.allMarkdownRemark
  const { currentPage, numPages } = pageContext
  const isFirst = currentPage === 1
  const isLast = currentPage === numPages
  const prevPage = currentPage - 1 === 1 ? `../` : (currentPage - 1).toString()
  const nextPage = (currentPage + 1).toString() //  `artwork/${pageContext.category}/${(currentPage + 1).toString()}`

  function getImageByCategory() {
    let image = imageBw;
    switch (pageContext.category) {
      case "all":
        image = imageAll;
        break;
      case "sketches":
        image = imageSketches;
        break;
      case "travel":
        image = imageTravel;
        break;
      case "colorful":
        image = imageColorful;
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
    if (Array.from(["all", "black-and-white", "colorful"]).includes(pageContext.category)) {
      imagePosition = "center center";
    }
    return imagePosition
  }
  // console.log("Artworks: ", artworks)
  const grouped = artworks
    .filter(artwork => pageContext.category == "all" ? true : (artwork.node.frontmatter.category.includes(pageContext.category)))
    .filter(artwork => artwork.node.frontmatter.title.length > 0)
    .reduce(function (acc, value, index) {
      const subArrayIndex = Math.floor(index / artworksPerRow);
      if (!acc[subArrayIndex]) {
        acc[subArrayIndex] = [];
      }
      acc[subArrayIndex].push(value);
      return acc;
    }, [])
  // console.log("grouped: ", grouped)

  function handleComponentChange(tab) {
    navigate(`/artwork/${tab}`)
  };

  return (
    <Layout pageInfo={{ pageName: "Artwork" }}>
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
            {grouped?.map((nodes, rowIndex) => {
              let numMissing = 4 - nodes.length
              // console.log("numMissing: ", numMissing)
              return (
                <Row className="collectionRow" key={rowIndex}>
                  {nodes.map((node, index) => (
                    <React.Fragment key={index}>
                      <CollectionItem node={node.node} subTitle={pageContext.category == "all" ? true : false} />
                    </React.Fragment>
                  ))
                  }
                  {
                    Array.from({ length: numMissing }).map((_, index) => (
                      <div key={index} className={`col-${12 / artworksPerRow} col-lg-3 col`} />

                    ))
                  }
                </Row>
              );
            })}
          </Container>
          {(!grouped || grouped.length === 0) ? <p className="noPictures">No pictures uploaded (yet)</p> :
            (<div className="pagination">
              <ul>
                {!isFirst && (
                  <Link to={`/artwork/${pageContext.category}/${prevPage}`} rel="prev">
                    ← <span className='d-none d-sm-block d-sm-none d-md-block'>Previous Page</span>
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
                        textDecoration: 'none',
                        color: i + 1 === currentPage ? '#818844' : '', //primary green
                        padding: "10px",
                        border: i + 1 === currentPage ? '1px solid #818844' : '',
                      }}
                    >
                      {i + 1}
                    </Link>
                  </li>
                ))}
                {!isLast && (
                  <Link to={`/artwork/${pageContext.category}/${nextPage}`} rel="next">
                    <span className='d-none d-sm-block d-sm-none d-md-block'>Next Page</span> →
                  </Link>
                )}
              </ul>
            </div>)}
        </Container>
      </Container>
    </Layout>
  )
}


export const pageQuery = graphql`
query CollectionQuery($skip: Int!, $limit: Int!, $filter: MarkdownRemarkFilterInput!){
  allMarkdownRemark(
    filter: $filter,
    sort: { frontmatter: { date: DESC }}
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
                gatsbyImageData(width: 400)
            }
          }
          image { 
            childImageSharp {
                gatsbyImageData(width: 800)
            }
          }
        }
      }
    }
  }
}
`

