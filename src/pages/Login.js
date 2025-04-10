import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Image,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

export const Login = () => {
  const [email, setemail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const jobIllustration =
    "https://img.freepik.com/premium-vector/illustration-vector-graphic-cartoon-character-recruitment_516790-2024.jpg";

  useEffect(() => {
    let timer;
    if (resendDisabled) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendDisabled]);

  const handleOTP = async () => {
    if (!email) {
      setErrorMessage("Email is required!");
      return;
    }

    if (!emailRegex.test(email)) {
      setErrorMessage("Invalid email format. Please enter a valid email.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/create-user", {
        email,
      });
      if (response?.data?.status) {
        setOtpSent(true);
        setErrorMessage("");
        setMessage("OTP sent successfully!");
        setResendDisabled(true);
      } else {
        setErrorMessage(response?.data?.message || "Failed to send OTP.");
      }
    } catch (error) {
      setErrorMessage("Error sending OTP. Please try again.");
      console.error(error);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/create-user", {
        email,
      });
      console.log("OTP resent:", response);
      setMessage("OTP resent successfully!");
      setResendDisabled(true);
    } catch (error) {
      console.error("Error resending OTP:", error);
      setMessage("Error resending OTP. Try again.");
    }
    setResendLoading(false);
  };

  const handleOtpChange = (value, index) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value.slice(-1);
    setOtp(updatedOtp);

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleVerify = async () => {
    try {
      const joinedOtp = otp.join("");
      const response = await axios.post(
        "http://localhost:8000/verifyOtp",
        { email, OTP: joinedOtp },
        { headers: { "Content-Type": "application/json" } }
      );
      setMessage(response.data.message);
      if (response.status === 200) {
        Cookies.set("token", response.data.token, { expires: 1 }); 

        if (response.data.newUser) {
          navigate("/UserDetails");
        } else {
          navigate("/");
        }

        window.location.reload();
      }
    } catch (error) {
      console.error(
        "Error verifying OTP:",
        error.response?.data || error.message
      );
      setMessage(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
<div
  className="d-flex align-items-center justify-content-center vh-100 text-white"
  style={{
    background: "linear-gradient(135deg, #1e3c72, #2a5298)",
    overflow: "hidden",
  }}
>
  <Container
    className="glass-card p-4 rounded-4 shadow-lg text-center position-relative"
    style={{
      maxWidth: "400px",
      backdropFilter: "blur(15px)",
      background: "rgba(255, 255, 255, 0.1)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
    }}
  >
    <Image
      src="https://img.freepik.com/premium-vector/illustration-vector-graphic-cartoon-character-recruitment_516790-2024.jpg"
      alt="Job Search"
      className="rounded mx-auto d-block mb-3"
      style={{ width: "100px", height: "100px", objectFit: "cover" }}
    />

    <h5 className="fw-bold mb-3">Find Your Dream Job</h5>

    {!otpSent ? (
      <>
        <Form.Control
          type="email"
          value={email}
          onChange={(e) => setemail(e.target.value)}
          placeholder="Enter your email"
          className="text-center bg-transparent text-white border-light rounded-pill mb-3"
          style={{ backdropFilter: "blur(5px)" }}
        />

        <Button
          onClick={handleOTP}
          variant="light"
          className="w-100 rounded-pill fw-semibold"
          disabled={verifying}
        >
          {verifying ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <>
              Send OTP <i className="bi bi-send ms-2" />
            </>
          )}
        </Button>
      </>
    ) : (
      <>
        <h6 className="mb-2">Enter OTP</h6>
        <Row className="justify-content-center mb-3">
          {otp.map((digit, index) => (
            <Col xs="3" key={index}>
              <Form.Control
                id={`otp-${index}`}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                maxLength="1"
                className="text-center bg-transparent text-white border-light fs-4 rounded"
              />
            </Col>
          ))}
        </Row>

        <Button
          onClick={handleVerify}
          variant="success"
          className="w-100 rounded-pill fw-semibold"
          disabled={verifying}
        >
          {verifying ? (
            <>
              <Spinner animation="border" size="sm" /> Verifying...
            </>
          ) : (
            "Verify OTP"
          )}
        </Button>

        <p className="text-light mt-3 mb-1" style={{ fontSize: "0.9rem" }}>
          Didn’t get the OTP?
        </p>
        <Button
          variant="link"
          className="text-warning p-0"
          disabled={resendDisabled || resendLoading}
          onClick={handleResendOtp}
        >
          {resendLoading ? (
            <>
              <Spinner animation="border" size="sm" /> Sending...
            </>
          ) : resendDisabled ? (
            `Resend in ${countdown}s`
          ) : (
            "Resend OTP"
          )}
        </Button>
      </>
    )}

    {(errorMessage || message) && (
      <p
        className={`mt-3 ${
          errorMessage ? "text-danger" : "text-success"
        } small`}
      >
        {errorMessage || message}
      </p>
    )}
  </Container>
</div>
)}