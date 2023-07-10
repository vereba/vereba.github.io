import React from "react"
import { Row, Col, Container } from "react-bootstrap"
import Layout from "../components/layout"

import PageHeading from "../components/pageHeading"

import aboutImage from "../assets/images/pageHeadings/about.jpg";
import { StaticImage } from "gatsby-plugin-image";

const AboutPage = ({ props }) => {

  return (
    <Layout pageInfo={{ pageName: "News" }}>
      <PageHeading
        pageTitle={`News`}
        pageImage={aboutImage}
      />
      <Container fluid >
        <Container className="content">
          <Row>
         
          </Row>
        </Container>
      </Container>
    </Layout>
  )
}

export default AboutPage
