import React, { useState } from 'react';
import {
  Row,
  Col,
  Container,
} from "react-bootstrap"
import Layout from "../components/layout"

import PageHeading from "../components/pageHeading"
import Collection from "../components/collection"

import artworkImage from "../assets/images/pageHeadings/artwork.jpg";
import PageMenu from '../components/pageMenu';

import {collections} from "../constants"

class ArtworkPage extends React.Component {

  categories: { [key: string]: string } = collections

  constructor(props) {
    super(props);
    this.state = {
      selectedCollection: this.categories["black-and-white-painting"]
    };
  }


  handleComponentChange(tab: string) {
    this.selectedCollection = this.categories[tab];
    this.setState({
      selectedCollection: this.categories[tab]
    })
  };


  render() {

    return (
      <Layout pageInfo={{ pageName: "Artworks" }}>
        <PageHeading
          pageTitle={`Artwork`}
          pageImage={artworkImage}
        />
        <Container fluid >
          <Container className="align-items-center tabs">
            <PageMenu
              menuItems={this.categories}
              selectedItem={this.state.selectedCollection}
              onItemSelected={(tab) => this.handleComponentChange(tab)} />
            <Row>
              <Col>
                <Collection selectedCollection={this.state.selectedCollection} />
              </Col>
            </Row>
          </Container>
          <div className="success-line" />
        </Container>
        <Container fluid style={{ marginTop: "-2.5rem" }}>
          <PageHeading pageTitle={"Other recommended XAI methods"} />
        </Container>

      </Layout>
    )
  }
}
export default ArtworkPage
