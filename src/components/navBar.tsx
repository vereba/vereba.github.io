import React from "react"
import { StaticImage } from "gatsby-plugin-image"
import { Link } from "gatsby"
import { BiRightArrow } from "react-icons/bi"
import { BsInstagram } from "react-icons/bs"
import { collections } from "../constants"

// import logo from '../images/logo/logo_weiß_grün.png';

import { Navbar, Nav, Container } from "react-bootstrap"

const PageNavbar = ({ pageInfo }) => (
  <Navbar expand="lg" id="site-navbar">
  <Container className="d-flex justify-content-between" id="navbar-container">
  <Navbar.Brand id="brand" >
  <Link to="/start" className="link-no-style">
          <Nav.Link as="span" eventKey="result">
          <StaticImage
          src="../images/logo/logo_green_long.png"
          // placeholder="blurred"
          // width={90}
          height={90}
          alt="vb"
          transformOptions={{ fit: "cover", cropFocus: "attention" }}/>
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
