import React, { useState } from "react"
import { Row, Col, Container, Button, Form, Alert, FormFloating } from "react-bootstrap"
import Layout from "../components/layout"
import emailjs from 'emailjs-com'
import ClipLoader from "react-spinners/ClipLoader";

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
  const [showMessage, setShowMessage] = useState<string>("");
  let [loading, setLoading] = useState(false);

  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const userId = process.env.EMAILJS_USER_ID;

  const handleChange = (event) => {
    //this console.log message should be removed once you've tested the event works 
    // console.log(
    //   "handleChange -> " + event.target.name + " : " + event.target.value
    // );
    //this is the important bit
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  const validate = (values) => {
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
    // console.log(errors)

    if (Object.keys(errors).length === 0) {
      return true;
    } else {
      return false;
    }
  };

  const sendConfirmationMail = (reply_to: string, to_name: string, message: string) => {
    // console.log("In sendConfirmationMail")
    const templateParams = {
      reply_to: reply_to,
      to_name: to_name,
      message: message,
    };
    emailjs.send(serviceId, process.env.EMAILJS_CONFIRMATION_TEMPLATE_ID, templateParams, userId)
      .then(response => {
        // console.log("Confirmation mail sent successfully!", response)
      })
      .catch(error => {
        console.error("Error sending confirmation email:", error)
      });
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    if (validate(values)) {
      // console.log("Validation successful")
      const templateParams = {
        from_name: values.name,
        from_email: values.email,
        message: values.message,
      };

      emailjs.send(serviceId, templateId, templateParams, userId)
        .then(response => {
          //console.log("Email sent successfully!", response)
          setLoading(false);
          setShowMessage("Thank you for your message, we will be in touch in no time!");

          sendConfirmationMail(values.email, values.name, values.message);
          setValues({
            name: "",
            email: "",
            message: ""
          });
        })
        .catch(error => {
          console.error("Error sending email:", error)
          setShowMessage("Error sending contact form. Please try again later or manually contact me via <a href='mailto:contact@vb-art.com'>contact@vb-art.com</a>");
        });
    }
  }
  return (

    <Form id="contactForm" className="marginBottom" onSubmit={handleFormSubmit}>
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
        <Form.Label>Message</Form.Label>
        <Form.Control as="textarea" name="message" rows={3}
          value={values.message}
          onChange={handleChange}
          required
          placeholder="Your message" />
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

      {
        showMessage && <span className="formMessage">{showMessage}</span>
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
        <Container>
          <Row>
            <Col className="col-12 col-lg-4 ">
              <h2 className="cite-big">Inquiries, questions, inspiration..?</h2>
              <p>I am happy about your interest in my work and about contacting me!</p>
              <p>I will get back to you as soon as possible.</p>
              <p><i>I am a fan of data minimisation: Your information is only used to send me an e-mail. Your data will not be saved!</i></p>
            </Col>
            <Col className="col-lg-7 offset-lg-1 col-12">
              <ContactForm />
            </Col>
          </Row>
        </Container>
      </Container>
    </Layout>
  )
};

export default ContactPage;
