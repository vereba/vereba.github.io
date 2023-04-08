import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Container,
    Tab,
    Tabs,
    Button,
    Form,
    OverlayTrigger,
    Alert,
    Popover,
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

    handleItemClick = (key) => {
        this.props.onItemSelected(key);
    };


    categoryTabs() {
        return (
            Object.keys(this.menuItems).map((key) =>
                <li key={key}
                    className={this.props.selectedItem == this.menuItems[key]? "selected" : ""}>
                    <span
                        onClick={() => this.handleItemClick(key)}>
                        {this.menuItems[key]}
                    </span>
                </li>
            )
        )
    }

    render() {
        return(
            <Container className = "align-items-center tabs" >
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