import React from "react"
import { Row, Col, Container } from "react-bootstrap"
import "./../styles/components/pageHeading.scss"

const PageHeading = ({ pageTitle, pageImage }) => {

  const color = "red";

  return (
    <div class="heading">


      <Container fluid>
      <div class="page-image-container" style={{backgroundImage: `url(${pageImage})`}}>
        <Container fluid className="title-background">
          <Container>
            <div class="title">
            <h1>{pageTitle}</h1>
            </div>
          </Container>
        </Container>
      </div>
    </Container>
    </div>
  )



}

export default PageHeading
