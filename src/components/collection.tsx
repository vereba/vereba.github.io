import React from "react"
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
import Layout from "./layout"

import PageHeading from "./pageHeading"
const CollectionPage = ({ selectedCollection }) => {


  return (
<><h1>This is a collection</h1><p>{selectedCollection}</p></>

  )
}

export default CollectionPage
