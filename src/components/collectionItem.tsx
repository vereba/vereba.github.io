import React from 'react';
import { Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import {
    Col
} from "react-bootstrap"
import { collections } from "../constants"


export default function CollectionItem({ node, subTitle }) {
    const title = node.frontmatter.title || node.fields.slug
    let image = getImage(node.frontmatter.imagePreview?.childImageSharp?.gatsbyImageData)

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
                    {subTitle && <div className='subtitle'>{collections[node.frontmatter.category[0]]}</div>}
                    <div className="title">{title}</div>
                </div>
            </Link>
        </Col >
    )
}