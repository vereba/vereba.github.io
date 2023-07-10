/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import { StaticQuery, graphql, Link } from "gatsby"
import SEO from "../components/seo"
import { BsInstagram } from "react-icons/bs"

import { Container, Row, Col, ThemeProvider } from "react-bootstrap"

import Header from "./header"
import PageNavbar from "./navBar"
import theme from "./../theme.js"


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
      <ThemeProvider theme={theme}>
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
      </ThemeProvider>
    )}
  />
)

export default Layout
