import React from "react"
import { BsInstagram } from "react-icons/bs"
import { Container, Row, Col } from "react-bootstrap"
import { Link } from "gatsby"
import { INSTAGRAM_URL } from "../constants"

const Footer = () => (
  <Container fluid>
    <Row>
      <Col className="footer-col">
        <footer>
          <Container>
            <span>© {new Date().getFullYear()}, Verena Barth</span>
            <span style={{ display: "flex" }}>
              <Link to="/imprint" className="link-no-style">
                Imprint
              </Link>
              <span style={{ width: "2rem", display: "block" }}></span>
              <a href={INSTAGRAM_URL}>
                <BsInstagram />
              </a>
            </span>
          </Container>
        </footer>
      </Col>
    </Row>
  </Container>
)

export default Footer
