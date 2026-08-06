import React from "react"
import { StaticImage } from "gatsby-plugin-image"
import { Link } from "gatsby"
import { BsInstagram } from "react-icons/bs"
import { collections, INSTAGRAM_URL } from "../constants"

import { Navbar, Nav, Container } from "react-bootstrap"

const PageNavbar = ({ pageName }: { pageName?: string }) => (
  <Container fluid className="header">
    <Navbar expand="lg" id="site-navbar">
      <Container className="d-flex justify-content-between" id="navbar-container">
        <Navbar.Brand id="brand">
          <Link to="/home/" className="link-no-style">
            <Nav.Link as="span" eventKey="result">
              <StaticImage
                src="../images/logo/logo_green_long.png"
                height={90}
                alt="vb-art"
                transformOptions={{ fit: "cover", cropFocus: "center" }}
              />
            </Nav.Link>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto" activeKey={pageName}>
            <Link to="/home/" className="link-no-style">
              <Nav.Link as="span" eventKey="start">
                Home
              </Nav.Link>
            </Link>
            <Link to="/home/#about" className="link-no-style">
              <Nav.Link as="span" eventKey="about">
                About
              </Nav.Link>
            </Link>

            <Link to={`/artwork/${Object.keys(collections)[0]}`} className="link-no-style">
              <Nav.Link
                as="span"
                eventKey="artwork"
                className={pageName?.toLowerCase() === "artwork" ? "selected" : ""}
              >
                Artwork
              </Nav.Link>
            </Link>
            <Link to="/home/#exhibitions" className="link-no-style">
              <Nav.Link as="span" eventKey="exhibitions">
                Exhibitions
              </Nav.Link>
            </Link>

            <Link to="/home/#contact" className="link-no-style">
              <Nav.Link as="span" eventKey="contact">
                Contact
              </Nav.Link>
            </Link>
            <a href={INSTAGRAM_URL} style={{ paddingLeft: "0.5rem" }}>
              <BsInstagram />
            </a>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  </Container>
)

export default PageNavbar
