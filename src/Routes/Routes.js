import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '../pages/Home';
import { JobList } from '../pages/JobList';
import { Login } from '../pages/Login';
import Cookies from 'js-cookie';
import { UserDetailsForm } from '../pages/UserDetails';


 export const Auth = () => {
    const isAuthenticated = Cookies.get("token") || false;

  return (
    <Routes>
      {isAuthenticated? ( 
        <>
      <Route path="/" element={<Home />} />
      <Route path="/UserDetails" element={<UserDetailsForm  />} />
      <Route path="/jobs" element={<JobList />} />
      <Route path="/*" element={<Navigate to={"/"}/>}/>

      </>
      ):( 
        <>
      <Route path="*" element={<Navigate to = '/login'/>} />
      <Route path="/login" element={<Login />} />
     
      </>
      )}
    </Routes>
  );
};

