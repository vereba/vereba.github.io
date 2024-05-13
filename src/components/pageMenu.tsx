import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Container } from "react-bootstrap";
import { useMediaQuery } from 'react-responsive';
import "./../styles/components/pageMenu.scss"

const PageMenu = (props) => {
    const menuItems = props.menuItems;

    // Use the useMediaQuery hook to detect screen size
    const isSmallScreen = useMediaQuery({ query: '(max-width: 576px)' });

    // Handle the item selection
    const handleItemSelected = (key) => {
        // console.log("handleItemSelected: ", key)
        props.onItemSelected(key);
    };

    const categoryTabs = () => {
        return Object.keys(menuItems).map((key) => (
            <li
                key={key}
                className={props.selectedItem === key ? "selected" : ""}
                onClick={() => handleItemSelected(key)}
            >
                <span>{menuItems[key]}</span>
            </li>
        ));
    };

    // Render the dropdown on small screens, and the regular list on larger screens
    return (
        <Container className="page-menu tabs">
            <Row>
                <Col md="12" className="align-items-center">
                    {isSmallScreen ? (
                        <select className="collectionSelect form-select btn" onChange={(event) => handleItemSelected(event.target.value)}>
                            {Object.keys(menuItems).map((key) => (
                                <option key={key} value={key} selected={props.selectedItem === key} className={props.selectedItem === key ? "selected" : ""}>{menuItems[key]}</option>
                            ))
                            }
                        </select>
                    ) : (
                        <ol>{categoryTabs()}</ol>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

PageMenu.propTypes = {
    menuItems: PropTypes.object,
    selectedItem: PropTypes.string,
    onItemSelected: PropTypes.func,
};

export default PageMenu;
