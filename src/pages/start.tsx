import React from "react"
import Layout from "../components/layout"
import backgroundImage from "../assets/images/favela_100x70.jpg";


const StartPage = () => (<Layout pageInfo={{ pageName: "Home" }} id="home">
  <div className="page-image-container" id="home-image"
    style={{
      backgroundImage: `url(${backgroundImage})`,
    }}
  >
  </div>
</Layout>
)

export default StartPage
