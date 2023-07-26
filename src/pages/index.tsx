import { useEffect } from "react"
import { navigate } from "@reach/router"

const IndexPage = () => {
  useEffect(() => {
    navigate("/start/")
    window.location.reload()
  }, [])
  return null
}
export default IndexPage
