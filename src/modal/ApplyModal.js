import axios from "axios";
import React, { useState } from "react";
import Cookies from 'js-cookie'

export const ApplyModal = ({ show, onClose, job, onSuccess }) => {
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);

  const handleSubmit = async () => {
    if (!resume) return alert("Please upload your resume");

    const formData = new FormData();
    formData.append("resume", resume);
    if (coverLetter) formData.append("coverLetter", coverLetter);
    formData.append("jobId", job?.slug || job?.id || job?.url);

    try {
      const res = await axios("http://localhost:8000//apply-job", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Application submitted!");
        onSuccess?.();
        onClose();
      } else {
        alert(data.message || "Application failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  if (!show) return null;

  return (
    <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content"  style={{ backgroundColor: "rgb(55, 37, 37)" }}>
          <div className="modal-header" >
            <h5 className="modal-title text-white">Apply for {job?.title}</h5>
            <button onClick={onClose} className="btn-close" />
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Resume</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => setResume(e.target.files[0])}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Cover Letter (optional)</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => setCoverLetter(e.target.files[0])}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button onClick={handleSubmit} className="btn btn-success">
              Submit Application
            </button>
            <button onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
