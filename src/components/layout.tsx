/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import SEO from "../components/seo"
import { Container } from "react-bootstrap"
import PageNavbar from "./navBar"
import Footer from "./footer"

const Layout = ({ pageInfo, children }) => (
  <>
    <SEO pageTitle={pageInfo.pageName} />
    <Container fluid className="header">
      <PageNavbar pageName={pageInfo.pageName} />
    </Container>

    <Container fluid className="content">
      <Container fluid>
        <main>{children}</main>
      </Container>
    </Container>
    <Footer />
  </>
)

export default Layout
