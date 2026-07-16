import React, { useState } from "react"
import { Row, Col, Container, Button, Form, Alert, FormFloating } from "react-bootstrap"
import Layout from "../components/layout"
import emailjs from "emailjs-com"
import ClipLoader from "react-spinners/ClipLoader"

import PageHeading from "../components/pageHeading"
import aboutImage from "../assets/images/pageHeadings/about.jpg"
import { CONTACT_EMAIL } from "../constants"

export interface FormFields {
  name: string
  message_email: string
  message: string
}

const ContactForm = () => {
  const [values, setValues] = useState<FormFields>({
    name: "",
    message_email: "",
    message: "",
  })
  const [formerrors, setFormErrors] = useState<FormFields | undefined>()
  const [showMessage, setShowMessage] = useState<string>("")
  let [loading, setLoading] = useState(false)

  const serviceId = process.env.GATSBY_EMAILJS_SERVICE_ID;
  const templateId = process.env.MESSAGE_EMAILJS_TEMPLATE_ID;
  const confirmationTemplateId = process.env.CONFIRMATION_EMAILJS_TEMPLATE_ID;
  const userId = process.env.GATSBY_EMAILJS_USER_ID;

  const handleChange = (event) => {
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }))
  }

  const validate = (values) => {
    let errors: any = {}

    //name field
    if (!values.name) {
      errors["name"] = "Full name is required"
    }

    //email field
    if (!values.message_email) {
      errors["message_email"] = "Email address is required"
    } else if (!/\S+@\S+\.\S+/.test(values.message_email)) {
      errors.message_email = "Email address is invalid"
    }

    setFormErrors(errors)

    if (Object.keys(errors).length === 0) {
      return true
    } else {
      return false
    }
  }

  const sendConfirmationMail = (reply_to: string, to_name: string, message: string) => {
    const templateParams = {
      reply_to: reply_to,
      to_name: to_name,
      message: message,
    }
    emailjs
      .send(serviceId, confirmationTemplateId, templateParams, userId)
      .then(() => { })
      .catch((error) => {
        console.error("Error sending confirmation email:", error)
      })
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()

    setLoading(true)
    if (validate(values)) {
      const templateParams = {
        from_name: values.name,
        from_email: values.message_email,
        message: values.message,
      }

      emailjs
        .send(serviceId, templateId, templateParams, userId)
        .then(() => {
          setLoading(false)
          setShowMessage("Thank you for your message, we will be in touch in no time!")
          sendConfirmationMail(values.message_email, values.name, values.message)
          setValues({
            name: "",
            message_email: "",
            message: "",
          })
        })
        .catch((error) => {
          console.error("Error sending email:", error)
          setShowMessage(
            `Error sending contact form. Please try again later or manually contact me via <a href='mailto:${CONTACT_EMAIL}'>${CONTACT_EMAIL}</a>`
          )
        })
    }
  }
  return (
    <Form id="contactForm" onSubmit={handleFormSubmit}>
      <Form.Group controlId="formGridName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          placeholder="Your Name"
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
          required
        />
        {formerrors?.name && (
          <div className="alert alert-danger" role="alert">
            {formerrors.name}
          </div>
        )}
      </Form.Group>

      <Form.Group as={Col} controlId="formGridEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          placeholder="Your Email"
          type="email"
          name="email"
          value={values.message_email}
          onChange={handleChange}
          required
        />
        {formerrors?.message_email && (
          <div className="alert alert-danger" role="alert">
            {formerrors.message_email}
          </div>
        )}
      </Form.Group>
      <Form.Group as={Col} controlId="formGridMessage">
        <Form.Label>Message</Form.Label>
        <Form.Control
          as="textarea"
          name="message"
          rows={3}
          value={values.message}
          onChange={handleChange}
          required
          placeholder="Your message"
        />
        {formerrors?.message && (
          <div className="alert alert-danger" role="alert">
            {formerrors.message}
          </div>
        )}
      </Form.Group>
      <div className="formButtonRow">
        <Button type="submit" variant="primary" size="lg">
          Submit
        </Button>
        <ClipLoader
          color={"#818844"} //primary-green
          loading={loading}
          // cssOverride={override}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>

      {showMessage && <span className="formMessage">{showMessage}</span>}
    </Form>
  )
}

const ContactPage = ({ props }) => {
  return (
    <Layout pageInfo={{ pageName: "Contact" }}>
      <PageHeading pageTitle={`Contact`} pageImage={aboutImage} />
      <Container fluid className="marginBottom">
        <Container>
          <Row>
            <Col className="col-12 ">
              {/* <Col className="col-12 col-lg-4 "> */}
              <h2 className="cite-big">Inquiries, questions, inspiration..?</h2>
              <p>I am happy about your interest in my work and about contacting me!</p>

              <p>
                My email adress is <br></br>
                <b>{CONTACT_EMAIL}</b>
              </p>

              <p>I will get back to you as soon as possible.</p>
              {/* <p><i>I am a fan of data minimisation: Your information is only used to send me an e-mail. Your data will not be saved!</i></p>*/}
            </Col>
            {/* <Col className="col-lg-7 offset-lg-1 col-12">
              <ContactForm />
            </Col> */}
          </Row>
        </Container>
      </Container>
    </Layout>
  )
}

export default ContactPage
