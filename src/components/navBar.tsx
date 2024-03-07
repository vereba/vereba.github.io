import React from "react"
import { StaticImage } from "gatsby-plugin-image"
import { Link } from "gatsby"
import { BsInstagram } from "react-icons/bs"
import { collections } from "../constants"


import { Navbar, Nav, Container } from "react-bootstrap"

const PageNavbar = ({ pageName }) => (
  <Navbar expand="lg" id="site-navbar">
    <Container className="d-flex justify-content-between" id="navbar-container">
      <Navbar.Brand id="brand" >
        <Link to="/start" className="link-no-style">
          <Nav.Link as="span" eventKey="result">
            <StaticImage
              src="../images/logo/logo_green_long.png"
              height={90}
              alt="vb-art"
              transformOptions={{ fit: "cover", cropFocus: "attention" }} />
          </Nav.Link>
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav
          className="mr-auto"
          activeKey={pageName}
        >
          <Link to="/start" className="link-no-style">
            <Nav.Link as="span" eventKey="start">
              Home
            </Nav.Link>
          </Link>
          <Link to="/about" className="link-no-style">
            <Nav.Link as="span" eventKey="about">
              About
            </Nav.Link>
          </Link>

          <Link to={`/artwork/${Object.keys(collections)[0]}`} className="link-no-style">
            <Nav.Link as="span" eventKey="artwork" className={pageName.toLowerCase() === "artwork" ? "selected" : ""}>
              Artwork
            </Nav.Link>
          </Link>

          {/*       
        <Link to="/news" className="link-no-style">
          <Nav.Link as="span" eventKey="news">
            News
          </Nav.Link>
        </Link> 
        
        */}
          <Link to="/exhibitions" className="link-no-style">
            <Nav.Link as="span" eventKey="exhibitions">
              Exhibitions
            </Nav.Link>
          </Link>


          <Link to="/contact" className="link-no-style">
            <Nav.Link as="span" eventKey="contact">
              Contact
            </Nav.Link>
          </Link>



          <a href="https://www.instagram.com/vb.artbook/"><BsInstagram /></a>

        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
)

export default PageNavbar
