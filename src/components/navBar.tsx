import React from "react"
import { Link } from "gatsby"
import { BiRightArrow } from "react-icons/bi"
import { BsInstagram } from "react-icons/bs"
import { collections } from "../constants"

import { Navbar, Nav, Container } from "react-bootstrap"

const PageNavbar = ({ pageInfo }) => (
  <Navbar expand="lg" id="site-navbar">
  <Container class="d-flex justify-content-between" id="navbar-container">
  <Navbar.Brand id="brand" >
  <Link to="/start" className="link-no-style">
          <Nav.Link as="span" eventKey="result">
          <span id="vb">vb</span>artbook
          </Nav.Link>
        </Link>
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav
        className="mr-auto"
        activeKey={pageInfo && pageInfo.pageName}
      >
        <Link to="/start" className="link-no-style">
          <Nav.Link as="span" eventKey="start">
            Home
          </Nav.Link>
        </Link>
        <Link to="/about" className="link-no-style">
          <Nav.Link as="span" eventKey="result">
            About
          </Nav.Link>
        </Link>
        

        <Link to={`/artwork/${Object.keys(collections)[0]}`} className="link-no-style">
          <Nav.Link as="span" eventKey="why">
            Artwork
          </Nav.Link>
        </Link>

        

        <Link to="/news" className="link-no-style">
          <Nav.Link as="span" eventKey="why">
            News
          </Nav.Link>
        </Link>
        
        <Link to="/contact" className="link-no-style">
          <Nav.Link as="span" eventKey="why">
            Contact
          </Nav.Link>
        </Link>
        <a href="https://www.instagram.com/vb.artbook/"><BsInstagram/></a>
        
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>
)
  
  /* 

  return (
    <RecommendationContext.Consumer>
      {rec => (
        <div>
          {rec.result == null ||
          rec.result.recommendation.length == 0 ? null : (
           
          )}
        </div>
      )}
    </RecommendationContext.Consumer>

    
  )
  */

export default PageNavbar
