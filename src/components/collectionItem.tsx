import React from 'react';
import { Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import {
    Col
} from "react-bootstrap"


export default function CollectionItem({ node } ) {
    const title = node.frontmatter.title || node.fields.slug
    let image = getImage(node.frontmatter.image?.childImageSharp?.gatsbyImageData)

    return (
        <Col key={`col-${node.frontmatter.title}`}>
            <Link to={`artwork/${node.frontmatter.category}/${node.fields.slug}`}>
                <div className="collectionItem" key={title}>
                    <GatsbyImage
                        image={image}
                        fluid={image}
                        alt={title}
                    />
                    <div className="title">{title}</div>
                </div>
            </Link>
        </Col >
    )
}