import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

export const UserDetailsForm = () => {
  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    jobTitle: "",
    description: "",
    location: "",
    salary: "",
    company: "",
    role: "seeker",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = Cookies.get("token");

 
    const checkUserDetails = async () => {
      try {
        const res = await axios.get("http://localhost:8000/user-details",{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data?.user || res.data?.saveDetails) {
        navigate("/");
      }
    } catch (err) {
      console.log("No user details found, continue to form.");
    }
  };
  useEffect(() => {
    if (token) {
      checkUserDetails();
    }
  }, []);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/user-details", formData, { 
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
      
      setMessage("User details submitted successfully!");
      if (res.status === 200) {
        navigate("/");
      }
    } catch {
      setMessage("Error submitting details");
    }
  };

  return (
    <Container className="mt-5 bg-black text-white">
      <h2>User Job Details</h2>
      {message && (
        <p className={message.includes("Error") ? "text-danger" : "text-success"}>
          {message}
        </p>
      )}
      <Form className="bg-dark text-white" onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Name *</Form.Label>
              <Form.Control
                style={{ backgroundColor: "#2f2a2a", color: "#fff" }}
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Job Title *</Form.Label>
              <Form.Control
                style={{ backgroundColor: "#2f2a2a", color: "#fff" }}
                type="text"
                name="jobTitle"
                required
                value={formData.jobTitle}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            style={{ backgroundColor: "#2f2a2a", color: "#fff" }}
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Location *</Form.Label>
              <Form.Control
                style={{ backgroundColor: "#2f2a2a", color: "#fff" }}
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Salary *</Form.Label>
              <Form.Control
                style={{ backgroundColor: "#2f2a2a", color: "#fff" }}
                type="number"
                name="salary"
                required
                value={formData.salary}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Company</Form.Label>
          <Form.Control
            style={{ backgroundColor: "#2f2a2a", color: "#fff" }}
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Role *</Form.Label>
          <Form.Select
            style={{ backgroundColor: "#2f2a2a", color: "#fff" }}
            name="role"
            required
            value={formData.role}
            onChange={handleChange}
          >
            <option value="seeker">Seeker</option>
            <option value="employer">Employer</option>
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
};
