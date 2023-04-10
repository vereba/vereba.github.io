import React from "react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
export default function CollectionItem({props}) {
    return (
        <div>
            <GatsbyImage
              image={props.imageSrc}
              alt={props.title}
            />
            {props.imageSrc}
            <div>{props.title}</div>
        </div>
    )
}