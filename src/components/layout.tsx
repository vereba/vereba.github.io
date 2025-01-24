/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import SEO from "../components/seo"
import { BsInstagram } from "react-icons/bs"
import { Container, Row, Col } from "react-bootstrap"
import PageNavbar from "./navBar"
import { Link } from "gatsby"

const Layout = ({ pageInfo, children }) => (
      <>
        <SEO pageTitle={pageInfo.pageName}/>
        <Container fluid className="header">
          <PageNavbar pageName={pageInfo.pageName}/>
        </Container>

        <Container fluid className="content">
          <Container fluid>
            <main>{children}</main>
          </Container>
        </Container>
        {
          <Container fluid>
            <Row>
              <Col className="footer-col">
                <footer>
                  <Container>
                    <span>
                      © {new Date().getFullYear()}, {" "}
                      Verena Barth
                    </span>
                    <span style={{display: "flex"}}>
                    <Link to="/imprint" className="link-no-style">
                        Imprint
                    </Link>
                    <span style={{width: "2rem",display: "block"}}></span>
                    <a href="https://www.instagram.com/vb.art.gallery/"><BsInstagram /></a>
                    </span>
                  </Container>
                </footer>
              </Col>
            </Row>
          </Container>
        }
      </>
)

export default Layout
