/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import { StaticQuery, graphql } from "gatsby"
import SEO from "../components/seo"
import { BsInstagram } from "react-icons/bs"

import { Container, Row, Col } from "react-bootstrap"

import PageNavbar from "./navBar"

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
            keywords
          }
        }
      }
    `}
    render={data => (
      <>
        <SEO title={data.site.siteMetadata.title} />

        <Container fluid className="header">
          <PageNavbar />
        </Container>

        <Container fluid className="content">
          <Container fluid>
            <main>{children}</main>
          </Container>
        </Container>
        {
          <Container fluid style={{ paddingLeft: 0, paddingRight: 0, marginTop: "3rem" }}>
            <Row>
              <Col className="footer-col">
                <footer>
                  <Container>
                    <span>
                      © {new Date().getFullYear()}, {" "}
                      Verena Barth
                    </span>
                    <a href="https://www.instagram.com/vb.artbook/"><BsInstagram /></a>
                  </Container>
                </footer>
              </Col>
            </Row>
          </Container>
        }
      </>
    )}
  />
)

export default Layout
