import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Container,
  } from "react-bootstrap"

  import "./../styles/components/pageMenu.scss"

class PageMenu extends React.Component {

    static propTypes = {
        menuItems: PropTypes.object,
        selectedItem: PropTypes.string,
        onItemSelected: PropTypes.func
    }

    menuItems: { [key: string]: string } = {};

    constructor(props) {
        super(props)
        this.menuItems = props.menuItems
        console.log(props)
    }

    categoryTabs() {
        return (
            Object.keys(this.menuItems).map((key) =>
                <li key={key}
                    className={this.props.selectedItem == key? "selected" : ""}>
                    <span
                        onClick={() => this.props.onItemSelected(key)}>
                        {this.menuItems[key]}
                    </span>
                </li>
            )
        )
    }

    render() {
        return(
            <Container className = "page-menu tabs" >
                <Row>
                <Col md="12" className = "align-items-center">
                    <ol>
                    {this.categoryTabs()}
                    </ol>
                </Col>
                </Row>
          </Container>
          )
    }
}

export default PageMenu;