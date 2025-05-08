import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ApplyModal } from '../modal/ApplyModal.js';

export const JobList = () => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const fetchJobs = async (titleVal, locationVal, pageVal) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/search', {
        params: { title: titleVal, location: locationVal, page: pageVal },
      });
      setJobs(response.data.jobs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (title || location) {
        setPage(1);
        fetchJobs(title, location, 1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [title, location]);

  useEffect(() => {
    if (page > 1) {
      fetchJobs(title, location, page);
    }
  }, [page]);

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  return (
    <div
      className="min-vh-100 py-5"
      style={{
        background: 'linear-gradient(to right, #8e2de2, #4a00e0)',
        color: 'white',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="container">
        <h2 className="text-center mb-5 display-5 fw-bold">Job Search</h2>

        <div className="row justify-content-center mb-4">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control mb-3 shadow-sm rounded-pill px-3 py-2"
              placeholder="Job Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control mb-3 shadow-sm rounded-pill px-3 py-2"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        {/* Job Cards */}
        <div className="row">
          {!loading &&
            jobs.map((job, index) => (
              <div key={index} className="col-md-6 mb-4">
                <div
                  className="card h-100 shadow-lg border-0 rounded-4 hover-shadow"
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  <div className="card-body text-dark">
                    <h5 className="card-title fw-bold">{job.title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      {job.company_name || job.company}
                    </h6>
                    <p>
                      <strong>Location:</strong> {job.location}
                    </p>
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary px-4 rounded-pill fw-semibold"
                    >
                      View Job
                    </a>
                  
                  </div>
                </div>
              </div>
            ))}
        </div>

   
      </div>
    </div>
  );
};
  