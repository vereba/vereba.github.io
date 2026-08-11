import React, { useState } from "react"
import { Col, Form, Button } from "react-bootstrap"
import emailjs from "emailjs-com"
import ClipLoader from "react-spinners/ClipLoader"

import { CONTACT_EMAIL } from "../constants"

export interface ContactFormFields {
  subject: string;
  name: string;
  email: string;
  message: string;
}

interface ContactFormProps {
  artworkTitle?: string;
}

const EMAIL_REGEX = /\S+@\S+\.\S+/

const ContactForm = ({ artworkTitle }: ContactFormProps) => {
  const [values, setValues] = useState<ContactFormFields>({
    subject: artworkTitle ? `Inquiry about "${artworkTitle}"` : "",
    name: "",
    email: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<ContactFormFields>>({});
  const [showMessage, setShowMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_MESSAGE_TEMPLATE_ID;
  const confirmationTemplateId = process.env.EMAILJS_CONFIRMATION_TEMPLATE_ID;
  const userId = process.env.EMAILJS_USER_ID;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  const validate = (values: ContactFormFields) => {
    const errors: Partial<ContactFormFields> = {};

    if (!values.subject) {
      errors.subject = "Subject is required";
    }

    if (!values.name) {
      errors.name = "Please provide your name.";
    }

    if (!values.email) {
      errors.email = "Email address is required";
    } else if (!EMAIL_REGEX.test(values.email)) {
      errors.email = "Email address is invalid";
    }

    if (!values.message) {
      errors.message = "Message is required";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const sendConfirmationMail = (reply_to: string, to_name: string, artwork: string, subject: string, message: string) => {
    const templateParams = {
      reply_to: reply_to,
      to_name: to_name,
      artwork: artwork,
      subject: subject,
      message: message,
    }
    emailjs
      .send(serviceId, confirmationTemplateId, templateParams, userId)
      .then(() => { })
      .catch((error) => {
        console.error("Error sending confirmation email:", error)
      })
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate(values)) {
      return;
    }
    // console.log(`serviceId: ${serviceId}, templateId: ${templateId}, userId: ${userId},`)
    if (!serviceId || !templateId || !userId) {
      setShowMessage(
        `Sorry, the contact form isn't set up yet. Please reach me directly at ${CONTACT_EMAIL}.`
      );
      return;
    }

    setLoading(true);
    const templateParams = {
      subject: values.subject,
      from_name: values.name,
      from_email: values.email,
      message: values.message,
      artwork: artworkTitle ?? "",
      to_email: CONTACT_EMAIL,
    };
    emailjs
      .send(serviceId, templateId, templateParams, userId)
      .then(() => {
        setLoading(false);
        setShowMessage("Thank you for your message, I will get back to you as soon as possible!");
        sendConfirmationMail(values.email, values.name, values.artwork, values.subject, values.message)
        setValues({
          subject: artworkTitle ? `Inquiry about "${artworkTitle}"` : "",
          name: "",
          email: "",
          message: "",
        });
      })
      .catch((error) => {
        console.error("Error sending contact form:", error);
        setLoading(false);
        setShowMessage(
          `Sorry, something went wrong sending your message. Please try again later or contact me directly at ${CONTACT_EMAIL}.`
        );
      });
  };

  return (
    <Form id="contactForm" onSubmit={handleFormSubmit}>

      <Form.Group as={Col} controlId="formGridName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          placeholder="Your Name"
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
          required
        />
        {formErrors.name && (
          <div className="alert alert-danger" role="alert">
            {formErrors.name}
          </div>
        )}
      </Form.Group>

      <Form.Group controlId="formGridSubject">
        <Form.Label>Subject</Form.Label>
        <Form.Control
          placeholder="Subject"
          type="text"
          name="subject"
          value={values.subject}
          onChange={handleChange}
          required
        />
        {formErrors.subject && (
          <div className="alert alert-danger" role="alert">
            {formErrors.subject}
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
        {formErrors.email && (
          <div className="alert alert-danger" role="alert">
            {formErrors.email}
          </div>
        )}
      </Form.Group>

      <Form.Group as={Col} controlId="formGridMessage">
        <Form.Label>Message</Form.Label>
        <Form.Control
          as="textarea"
          name="message"
          rows={4}
          value={values.message}
          onChange={handleChange}
          required
          placeholder="Your message"
        />
        {formErrors.message && (
          <div className="alert alert-danger" role="alert">
            {formErrors.message}
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
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
          className="loader"
        />
      </div>

      {showMessage && <span className="formMessage">{showMessage}</span>}
    </Form>
  );
};

export default ContactForm;
