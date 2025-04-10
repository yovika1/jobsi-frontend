import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div className="position-relative overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-100 vh-100 object-fit-cover position-absolute top-0 start-0 z-n1"
      >
        <source src="https://cdn.pixabay.com/video/2022/07/26/125618-733814655_large.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="container text-center text-white d-flex flex-column justify-content-center align-items-center vh-100">
        <h1 className="display-4 fw-bold">Welcome to Job Portal</h1>
        <p className="lead">Find your dream job or post a job opening!</p>
        <Link to="/jobs" className="btn btn-primary btn-lg mt-3 px-4">
          Browse Jobs
        </Link>
      </div>
    </div>
  );
};
