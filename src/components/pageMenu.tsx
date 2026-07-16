import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

const PageMenu = ({ menuItems, selectedItem, counts }) => {
  return (
    <div className="category-tabs">
      {Object.keys(menuItems).map((key) => (
        <Link key={key} to={`/artwork/${key}/`} className={selectedItem === key ? "active" : ""}>
          {menuItems[key]} <span className="count">({counts?.[key] ?? 0})</span>
        </Link>
      ))}
    </div>
  )
}

PageMenu.propTypes = {
  menuItems: PropTypes.object,
  selectedItem: PropTypes.string,
  counts: PropTypes.object,
}

export default PageMenu
