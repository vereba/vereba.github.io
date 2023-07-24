import "./../styles/style.scss"

import { useEffect } from "react"
import { navigate } from "@reach/router"

const IndexPage = () => {
  useEffect(() => {
    navigate("/start/",  {replace: true})
  }, [])
  return null
}
export default IndexPage
