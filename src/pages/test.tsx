import * as React from "react"
import { Link, graphql } from "gatsby"
import { Helmet } from "react-helmet"


export default function Test({ data }) {
    const { edges: artworks } = data.allMarkdownRemark
    return (
      <div className="artwork">
        {artworks
          .filter(artwork => artwork.node.frontmatter.title.length > 0)
          .map(({ node: artwork }) => {
            return (
              <div className="artwork-preview" key={artwork.id}>
                <h1>
                  <Link to={artwork.fields.slug}>{artwork.frontmatter.title}</Link>
                </h1>
                <h2>{artwork.frontmatter.date}</h2>
                <p>{artwork.excerpt}</p>
              </div>
            )
          })}
      </div>
    )
  }
  
  export const pageQuery = graphql`
    query IndexQueryAndIndexQuery {
        allMarkdownRemark(sort: {frontmatter: {date: DESC}}) {
        edges {
          node {
            excerpt(pruneLength: 250)
            id
            fields {
                slug
            }
            frontmatter {
              title
              date
            }
          }
        }
      }
    }
  `