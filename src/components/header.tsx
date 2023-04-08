import PropTypes from "prop-types"
import React from "react"
import { Link } from "gatsby"
import PageNavbar from "./navBar"

import "./../styles/components/header.scss"

/*
const HeaderProps = {
  siteTitle: string,
}

//export const Card: FunctionComponent<CardProps> = ({ siteTitle, defaultAttr = 'Hello World' }) => 
*/

const Header = ({ siteTitle, pageInfo }) => (
  <header>
    <div className="container-fluid">
      <div className="row">
        <div className="col">

                <Link to="/start">
                  <h1>{siteTitle}</h1>
                </Link>

        </div>

        <div className="col" id="navbar-container">
              
        </div>
      </div>
      <div className="row separator"> </div>
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
