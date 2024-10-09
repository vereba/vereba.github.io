import React from "react"
import { Row, Col, Container } from "react-bootstrap"
import Layout from "../components/layout"

import PageHeading from "../components/pageHeading"

import "./../styles/components/exhibitions.scss"

import aboutImage from "../assets/images/pageHeadings/exhibitions.jpg";
import { StaticImage } from "gatsby-plugin-image";

function Exhibition(year, dateFrom, dateTo, exhibition_name, location, description) {
    let date = dateTo ? `${dateFrom} - ${dateTo}${year}` : `${dateFrom}${year}`;
    return (
        <div className="exhibition">
            <h2 className="year">{year}</h2>
            <span className="leftContainer">
                <h2>{exhibition_name}</h2>
                <span className="subheading">
                    <p>{location}</p>
                    <p className="date">{date}</p>
                </span>
                <p>{description}</p>
            </span>


        </div >
    )
}

const AboutPage = ({ props }) => {
    return (
        <Layout pageInfo={{ pageName: "Exhibitions" }}>
            <PageHeading
                pageTitle={`Exhibitions`}
                pageImage={aboutImage}
            />
            <Container fluid >
                <Container>
                    <Row>
                        <Col md="5 marginBottom" className="paddingAround">
                            <StaticImage src="../assets/images/exhibition_me.jpg" alt="Verena Barth" id="me-image" />
                        </Col>
                        <Col className="exhibitions order-sm-first order-md-last marginBottom" md="7">
                            <h2>Solo Exhibitions</h2>
                            <hr className="title-break-left" />
                            {new Exhibition("2024", "16.02.", "24.03.", "Mindful walks - Travel sketches by verena barth", "Kunst- und Kultur Lokal Alte Feuerwache, Köln (Germany)")}

                            <h2>Group Exhibitions</h2>
                            <hr className="title-break-left" />

                            {new Exhibition("2024", "26.09.", "03.11.", "III. Kunstsommer/Herbst", "Galerie Eyegenart, Köln (Germany)")}
                            {new Exhibition("2023", "31.08.", "05.10.", "II. Kunstsommer/Herbst", "Galerie Eyegenart, Köln (Germany)")}

                            <h2>Live Painting</h2>
                            <hr className="title-break-left" />
                            {new Exhibition("2024", "21.09.", "", "Kunscht im Eck", "Dunningen (Germany)")}
                            {new Exhibition("2023", "19.12.", "22.12", "Solstice Festival", "Eagle's Nest Atitlán, San Marcos (Guatemala)")}
                            {new Exhibition("2023", "14.04.", "", "Kulturrummel", "viadee Unternehmensberatung, Köln (Germany)")}
                        </Col>
                    </Row>
                </Container>
            </Container>
        </Layout>
    )
}

export default AboutPage
