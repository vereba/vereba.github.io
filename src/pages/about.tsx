import React from "react"
import { Row, Col, Container } from "react-bootstrap"
import Layout from "../components/layout"

import PageHeading from "../components/pageHeading"

import aboutImage from "../assets/images/pageHeadings/about.jpg";

const AboutPage = ({ props }) => {

  return (
    <Layout pageInfo={{ pageName: "Further steps" }}>
      <PageHeading
        pageTitle={`About me`}
        pageImage={aboutImage}
      />
      <Container fluid className="keyvisual gray">
        <Container className="align-items-center">
          <Row>
            <Col md="12" style={{ marginBottom: "1rem" }}>
              <p>
                Um ein erklärbares, nachvollziehbares und faires Modell zu
                erhalten bzw. zu gewährleisten, empfehlen wir folgende Punkte zu
                beachten:
              </p>
            
            </Col>
          </Row>
        </Container>
      </Container>
      <Container fluid style={{ marginTop: "-2.5rem" }}>
        <PageHeading pageTitle={"Other recommended XAI methods"} />
      </Container>

    </Layout>
  )
}

export default AboutPage
