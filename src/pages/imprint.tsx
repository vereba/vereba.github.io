import React from "react"
import { Row, Col, Container } from "react-bootstrap"
import Layout from "../components/layout"

import PageHeading from "../components/pageHeading"

import aboutImage from "../assets/images/pageHeadings/on_wood_cut.jpg";
import { StaticImage } from "gatsby-plugin-image";

const AboutPage = ({ props }) => {

  return (
    <Layout pageInfo={{ pageName: "About me" }}>
      <PageHeading
        pageTitle={`Imprint`}
        pageImage={aboutImage}
      />
      <Container fluid >
        <Container>
          <Row>
          <Col className="imprint order-sm-first order-md-last marginBottom" md="7">

              <h2>Contact</h2>
              <p>
            <b>Verena Barth</b><br/>
              vb-art<br />
              Lessingstraße 27<br />
              50825 Köln</p>
              <p>Phone on request<br />
              E-Mail: contact@vb-art.com</p>


            <h2>Responsible for the content</h2>
            <p>Verena Barth<br />
              Lessingstraße 27<br />
              50825 Köln</p>

            </Col>
            <Col md="3" className="marginBottom d-xs-none" id="imprintImage">
            <StaticImage src="../assets/images/minimal_favela_1_a3.jpg" alt="Verena Barth" />
            </Col>
          </Row>
        </Container>
      </Container>
    </Layout>
  )
}

export default AboutPage
