import React from "react"
import { Row, Col, Container } from "react-bootstrap"
import "./../styles/components/pageHeading.scss"

const PageHeading = ({ pageTitle, pageImage, titleInline }) => {

  const color = "red";

  return (
    <div className="heading">


      <Container fluid>
      <div className="page-image-container" style={{backgroundImage: `url(${pageImage})`}}>
        <Container fluid className="title-background">
          {
            titleInline ? 
            <Container>
            <div className="title">
            <h1>{pageTitle}</h1>
            </div>
          </Container>
          :
          null
          }

        </Container>
      </div>
      {
            !titleInline ? 
            <Container className="title-outside">
            <div className="title">
            <h1>{pageTitle}</h1>
            <hr className="title-break-left"/>
            </div>
          </Container>
          :
          null
          }

    </Container>
    </div>
  )



}

export default PageHeading
