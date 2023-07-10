import React from "react"
import { Container } from "react-bootstrap"

import Layout from "../components/layout"
import PageHeading from "../components/pageHeading"
import { StaticImage } from "gatsby-plugin-image"

import backgroundImage from "../assets/images/favela_100x70.jpg";


const NotFoundPage = () => (
  <Layout pageInfo={{ pageName: "Not found" }}>
      <div className="page-image-container" id="home-image"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <p>hi</p>>
    </div>
  </Layout>
)

export default NotFoundPage
