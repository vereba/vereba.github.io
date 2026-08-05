import React, { useState, useEffect } from "react"
import { Link, graphql } from "gatsby"
import { StaticImage, GatsbyImage, getImage } from "gatsby-plugin-image"
import Carousel from "react-bootstrap/Carousel"
import { BsChevronUp, BsChevronDown, BsChevronLeft, BsChevronRight } from "react-icons/bs"
import SEO from "../components/seo"
import {
  homeCarouselIntervalMs,
  CAROUSEL_HEIGHT,
  CAROUSEL_CONTROL_WIDTH,
  THUMB_VISIBLE_COUNT,
  exhibitions,
  livePainting
} from "../constants"
import { calculateAge } from "../helper/date"

import "../styles/components/home.scss"
import PageNavbar from "../components/navBar"
import Footer from "../components/footer"
import ContactForm from "../components/contactForm"


function ExhibitionColumn({ title, groups }: { title: string; groups: any[] }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const toggle = (key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div className="exhibitions-col">
      <h3 className="subhead">{title}</h3>
      {groups.map((group) => {
        const key = `${title}-${group.year}`
        const isOpen = expanded.has(key)
        return (
          <div className={`year-group${isOpen ? " is-open" : ""}`} key={group.year}>
            <button
              type="button"
              className="year-label"
              onClick={() => toggle(key)}
              aria-expanded={isOpen}
            >
              {group.year}
              {isOpen ? <BsChevronUp /> : <BsChevronDown />}
            </button>
            <div className="year-entries">
              {group.entries.map((entry: any) => (
                <div className="exhibit-entry" key={entry.name}>
                  <p className="name">{entry.name}</p>
                  <p className="place">{entry.place}</p>
                  <p className="date">{entry.date}</p>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function Home({ data }: { data: any }) {
  const allArtworks = data.allMarkdownRemark.edges
  const age = calculateAge()
  const [activeIndex, setActiveIndex] = useState(0)
  const [thumbOffset, setThumbOffset] = useState(0)

  const artworks = allArtworks
  const heroImages = artworks.map(({ node }: any) =>
    getImage(
      node.frontmatter.image?.childImageSharp?.gatsbyImageData ??
      node.frontmatter.imagePreview?.childImageSharp?.gatsbyImageData
    )
  )

  useEffect(() => {
    if (activeIndex >= artworks.length) setActiveIndex(0)
  }, [artworks.length, activeIndex])

  // Keep the visible thumbnail window containing whichever slide is active,
  // e.g. after stepping through the main carousel's own prev/next arrows.
  useEffect(() => {
    setThumbOffset((offset) => {
      if (activeIndex < offset) return activeIndex
      if (activeIndex >= offset + THUMB_VISIBLE_COUNT) return activeIndex - THUMB_VISIBLE_COUNT + 1
      return offset
    })
  }, [activeIndex])

  const maxThumbOffset = Math.max(0, artworks.length - THUMB_VISIBLE_COUNT)
  const visibleThumbs = artworks.slice(thumbOffset, thumbOffset + THUMB_VISIBLE_COUNT)

  const activeImage: any = heroImages[activeIndex]
  const activeAspectRatio =
    activeImage?.width && activeImage?.height ? activeImage.width / activeImage.height : 1
  const carouselWrapWidth =
    Math.round(CAROUSEL_HEIGHT * activeAspectRatio) + CAROUSEL_CONTROL_WIDTH * 2

  // @ts-ignore SEO's PropTypes declares `title` as required but the component itself reads `pageTitle` — same pre-existing mismatch as in layout.tsx
  const seo = <SEO pageTitle="vb-art" />

  return (
    <div className="home">
      {seo}
      <PageNavbar />

      <div className="intro-hero">
        <div className="intro">
          <div className="eyebrow">Original Artwork</div>
          <h1>Verena Barth — Paintings between Light and Shadow</h1>
        </div>
      </div>
      <section id="about">
        <div className="section-eyebrow">About</div>
        <div className="about-layout">
          <StaticImage
            src="../assets/images/about_me_desktop.jpg"
            alt="Verena Barth"
            className="about-image-desktop"
          />
          <StaticImage
            src="../assets/images/about_me_mobile.jpg"
            alt="Verena Barth"
            className="about-image-mobile"
          />
          <div className="about-text">
            <h3>Verena Barth</h3>
            <p>
              Verena Barth is a {age}-year-old artist currently living in Cologne, Germany. She has
              been interested in art for as long as she can remember, but chose the safe career path
              of Data Science and Artificial Intelligence and is now giving more time to her
              passions of painting and travelling.
            </p>
            <p>
              She finds joy in the act of creating and drawing without restraint, using her fingers
              or any tool that resonates with the moment. This combination of different drawing
              materials and the interplay of black and white, of light and shadow result in images
              in which new details and hidden landscapes emerge with each viewing distance.
            </p>
            <h3>Inspiration</h3>
            <p>
              I love mindful walks and take a lot of inspiration out of it. During my time in the
              vibrant embrace of New York City, I began to like the towering skyscrapers reaching
              relentlessly towards the heavens. As a small village girl and nature enthusiast
              navigating those bustling streets, I immersed myself in the captivating dance between
              shadow and light, of black and white, the intricate compositions of lines and angles
              and the recursive reflections cascading upon glass facades.
            </p>
          </div>
        </div>
      </section>

      <section id="artwork">
        <div className="section-eyebrow">Artwork</div>
        <h2 className="section-title">A selection of recent work</h2>

        <div className="artwork-showcase">
          <div className="showcase-content">
            <div className="artwork-thumbs-rail">
              <button
                type="button"
                className="thumb-scroll thumb-scroll-up"
                onClick={() => setThumbOffset((offset) => Math.max(0, offset - 1))}
                disabled={thumbOffset <= 0}
                aria-label="Show earlier artworks"
              >
                <BsChevronUp className="thumb-scroll-icon-vertical" />
                <BsChevronLeft className="thumb-scroll-icon-horizontal" />
              </button>

              <div className="artwork-thumbs">
                {visibleThumbs.map(({ node }: any, i: number) => {
                  const index = thumbOffset + i
                  const thumbImage = getImage(
                    node.frontmatter.imagePreview?.childImageSharp?.gatsbyImageData
                  )
                  return (
                    <button
                      type="button"
                      key={node.fields.slug}
                      className={`artwork-thumb${index === activeIndex ? " active" : ""}`}
                      onClick={() => setActiveIndex(index)}
                      aria-label={`Show ${node.frontmatter.title}`}
                      aria-current={index === activeIndex}
                    >
                      {thumbImage && <GatsbyImage image={thumbImage} alt="" />}
                    </button>
                  )
                })}
              </div>
              <button
                type="button"
                className="thumb-scroll thumb-scroll-down"
                onClick={() => setThumbOffset((offset) => Math.min(maxThumbOffset, offset + 1))}
                disabled={thumbOffset >= maxThumbOffset}
                aria-label="Show later artworks"
              >
                <BsChevronDown className="thumb-scroll-icon-vertical" />
                <BsChevronRight className="thumb-scroll-icon-horizontal" />
              </button>
            </div>
          </div>

          <div
            className="artwork-carousel-wrap"
            style={
              {
                width: carouselWrapWidth,
                "--active-aspect-ratio": activeAspectRatio,
              } as React.CSSProperties
            }
          >
            <Carousel
              className="artwork-carousel"
              activeIndex={activeIndex}
              onSelect={(index: number) => setActiveIndex(index)}
              interval={homeCarouselIntervalMs}
              indicators={false}
            >
              {artworks.map(({ node }: any, index: number) => {
                const heroImage = heroImages[index]
                return (
                  <Carousel.Item key={node.fields.slug}>
                    <Link to={`/artwork${node.fields.slug}`} className="carousel-slide">
                      {heroImage && <GatsbyImage image={heroImage} alt={node.frontmatter.title} />}
                      {node.frontmatter.sold ? (
                        <span className="status-badge">{node.frontmatter.sold}</span>
                      ) : null}
                    </Link>
                    <p className="carousel-slide-title">{node.frontmatter.title} ({node.frontmatter.date})</p>
                  </Carousel.Item>
                )
              })}
            </Carousel>
          </div>
        </div>

        <Link className="view-all" to="/artwork/all/">
          View all artwork →
        </Link>
      </section>

      <section id="exhibitions">
        <div className="section-eyebrow">Exhibitions</div>
        <h2 className="section-title">exhibitions &amp; live painting</h2>

        <div className="exhibitions-columns">
          <ExhibitionColumn title="Exhibitions" groups={exhibitions} />
          <ExhibitionColumn title="Live painting" groups={livePainting} />
        </div>
      </section>

      <section id="contact">
        <div className="white-box">
          <div className="section-eyebrow">Contact</div>
          <h2 className="section-title">inquiries, questions, inspiration..?</h2>
          <div className="contact-box">
            <p>
              I am happy about your interest in my work and about contacting me. I will get back to
              you as soon as possible.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export const query = graphql`
  query HomeArtworkPreview {
    allMarkdownRemark(
      filter: {
        fileAbsolutePath: { regex: "/(artwork)/" }
        frontmatter: { title: { ne: "" }, showInCarousel: { eq: true } }
      }
      sort: { frontmatter: { date: DESC } }
      limit: 20
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            date
            sold
            imagePreview {
              childImageSharp {
                gatsbyImageData(width: 400)
              }
            }
            image {
              childImageSharp {
                gatsbyImageData(width: 1000)
              }
            }
          }
        }
      }
    }
  }
`
