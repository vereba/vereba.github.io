import React from "react"
import { Row, Col, Container } from "react-bootstrap"
import Layout from "../components/layout"

import PageHeading from "../components/pageHeading"

import aboutImage from "../assets/images/pageHeadings/about.jpg";
import { StaticImage } from "gatsby-plugin-image";

const AboutPage = ({ props }) => {

  return (
    <Layout pageInfo={{ pageName: "About me" }}>
      <PageHeading
        pageTitle={`About me`}
        pageImage={aboutImage}
      />
      <Container fluid >
        <Container className="content">
          <Row>
            <Col md="5">
              <StaticImage src="../assets/images/me.jpg" alt="Verena Barth" id="me-image" />
            </Col>
            <Col className="aboutme order-sm-first order-md-last " md="7">
              <h2>Verena Barth</h2>
              <p>
                Verena Barth is a 27-year-old artist currently living in Cologne, Germany.
                She has been interested in art for as long as she can remember, but chose the safe career path of Data Science and Artificial Intelligence and is now giving more time to her passions of painting and travelling.
              </p>
              <p>She finds joy in the act of creating and drawing without restraint, using her fingers or any tool that resonates with the moment. This combination of different drawing materials and the interplay of black and white, of light and shadow result in Images in which new details and hidden landscapes emerge with each viewing distance.</p>
              <h2>Inspiration</h2>
              <p>I love mindful walks and take a lot of inspiration out of it.<br />
                During my time in the vibrant embrace of New York City, I began to like the towering skyscrapers reaching relentlessly towards the heavens. As a small village girl and nature enthusiast navigating those bustling streets, I immersed myself in the captivating dance between shadow and light, of black and white, the intricate compositions of lines and angles and the recursive reflections cascading upon glass facades.
              </p>
            </Col>
          </Row>
        </Container>
      </Container>
    </Layout>
  )
}

export default AboutPage
