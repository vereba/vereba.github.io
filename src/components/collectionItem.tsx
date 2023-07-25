import React from 'react';
import { Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import {
    Col
} from "react-bootstrap"


export default function CollectionItem({ node }) {
    const title = node.frontmatter.title || node.fields.slug
    let image = getImage(node.frontmatter.image?.childImageSharp?.gatsbyImageData)

    return (
        <Col key={`col-${node.frontmatter.title}`} className="col-12 col-lg-3">
            <Link to={`/artwork${node.fields.slug}`}>
                <div className="collectionItem" key={title}>
                    <div className='image'>
                        <GatsbyImage
                            image={image}
                            fluid={image}
                            alt={title}
                        />
                    </div>

                    <div className="title">{title}</div>
                </div>
            </Link>
        </Col >
    )
}