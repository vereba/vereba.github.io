import React, { useState } from "react"
import { Row, Col, Container, Button, Form, Alert, FormFloating } from "react-bootstrap"
import Layout from "../components/layout"
import emailjs from 'emailjs-com'

import PageHeading from "../components/pageHeading"
import aboutImage from "../assets/images/pageHeadings/about.jpg";


export interface FormFields {
  name: string;
  email: string;
  message: string;
}

const ContactForm = () => {
  const [values, setValues] = useState<FormFields>({
    name: "",
    email: "",
    message: ""
  });
  const [formerrors, setFormErrors] = useState<FormFields | undefined>();
  const [showMessage, setShowMessage] = useState(false);

  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const userId = process.env.EMAILJS_USER_ID;

  const handleChange = (event) => {
    //this console.log message should be removed once you've tested the event works 
    console.log(
      "handleChange -> " + event.target.name + " : " + event.target.value
    );
    //this is the important bit
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  const validate = (values) => {
    console.log("Validate the form....");

    let errors: any = {};

    //name field
    if (!values.name) {
      errors["name"] = "Full name is required";
    }

    //email field
    if (!values.email) {
      errors["email"] = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email address is invalid";
    }

    setFormErrors(errors);
    console.log(errors)

    if (Object.keys(errors).length === 0) {
      return true;
    } else {
      return false;
    }
  };

  const sendConfirmationMail = (reply_to: string, to_name: string, message: string) => {
    console.log("In sendConfirmationMail")
    const templateParams = {
      reply_to: reply_to,
      to_name: to_name,
      message: message,
    };
    emailjs.send(serviceId, process.env.EMAILJS_CONFIRMATION_TEMPLATE_ID, templateParams, userId)
      .then(response => {
        console.log("Confirmation mail sent successfully!", response)
      })
      .catch(error => {
        console.error("Error sending confirmation email:", error)
      });
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (validate(values)) {
      console.log("Validation successful")
      const templateParams = {
        from_name: values.name,
        from_email: values.email,
        message: values.message,
      };

      emailjs.send(serviceId, templateId, templateParams, userId)
        .then(response => {
          console.log("Email sent successfully!", response)
          setShowMessage(true);
          sendConfirmationMail(values.name, values.email, values.message);
          setValues({
            name: "",
            email: "",
            message: ""
          });
        })
        .catch(error => {
          console.error("Error sending email:", error)
          setShowMessage(false);
        });

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
          value={values.email}
          onChange={handleChange}
          required
        />
        {formerrors?.email && (
          <div className="alert alert-danger" role="alert">
            {formerrors.email}
          </div>
        )}
      </Form.Group>
      <Form.Group as={Col} controlId="formGridMessage">
        <Form.Label>Your message</Form.Label>
        <Form.Control as="textarea" name="message" rows={3}
          value={values.message}
          onChange={handleChange}
          required />
        {formerrors?.message && (
          <div className="alert alert-danger" role="alert">
            {formerrors.message}
          </div>
        )}
      </Form.Group>
      <Button type="submit" variant="primary" size="lg">
        Submit {JSON.stringify(process.env)}
      </Button>
      {
        showMessage && <span className="formMessage">Thank you for your message, we will be in touch in no time!</span>
      }
    </Form>
  );

}


const ContactPage = ({ props }) => {

  return (
    <Layout pageInfo={{ pageName: "Contact" }}>
      <PageHeading
        pageTitle={`Contact`}
        pageImage={aboutImage}
      />
      <Container fluid >
        <Container className="content">
          <Row>
            <Col className="col-lg-4 col-sm-12">
              <h2>Inqueries, questions, inspiration..?</h2>
              <p>I am happy about your interest in my work and about contacting me!</p>
              <p>I will get back to you as soon as possible.</p>
            </Col>
            <Col className="col-lg-7 offset-lg-1 col-sm-12">
              <ContactForm />
            </Col>
          </Row>
        </Container>
      </Container>
    </Layout>
  )
};

export default ContactPage;
