import React, { useEffect, useRef, useState } from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import { BsChevronRight } from "react-icons/bs"

const HINT_SEEN_KEY = "categoryTabsHintSeen"

const PageMenu = ({ menuItems, selectedItem, counts }) => {
  const [showHint, setShowHint] = useState(false)
  const tabsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 640px)").matches
    if (isMobile && !window.localStorage.getItem(HINT_SEEN_KEY)) {
      setShowHint(true)
    }
  }, [])

  // Keep the selected category visible in the scrollable row, e.g. when
  // arriving directly on a category near the end (like "postcards") that
  // would otherwise be scrolled off to the right.
  useEffect(() => {
    const active = tabsRef.current?.querySelector("a.active")
    active?.scrollIntoView({ block: "nearest", inline: "center" })
  }, [selectedItem])

  const dismissHint = () => {
    if (!showHint) return
    setShowHint(false)
    window.localStorage.setItem(HINT_SEEN_KEY, "1")
  }

  return (
    <div className="category-tabs-wrap">
      <div className="category-tabs" ref={tabsRef} onScroll={dismissHint}>
        {Object.keys(menuItems).map((key) => (
          <Link
            key={key}
            to={`/artwork/${key}/`}
            className={selectedItem === key ? "active" : ""}
            onClick={dismissHint}
          >
            {menuItems[key]} <span className="count">{counts?.[key] ?? 0}</span>
          </Link>
        ))}
      </div>
      {showHint && (
        <div className="category-tabs-hint" aria-hidden="true">
          swipe <BsChevronRight />
        </div>
      )}
    </div>
  )
}

PageMenu.propTypes = {
  menuItems: PropTypes.object,
  selectedItem: PropTypes.string,
  counts: PropTypes.object,
}

export default PageMenu
