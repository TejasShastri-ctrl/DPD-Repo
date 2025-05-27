import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Layout from './Layout';
import Home from './Home';
import LoginForm from './LoginForm';
import Allotments from './Allotments';
import Products from './Products';
import SignupForm from './SignUpForm';
import AboutPage from './AboutPage';
import STLViewer from '../ThreeD/STLViewer';

function Root() {
  const user = useSelector((state) => state.auth.user);

  const isUserAuthenticated =
    user && typeof user === 'object' && Object.keys(user).length > 0 && user.username;

  return (
    <Routes>
      {!isUserAuthenticated ? (
        <>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="allotments" element={<Allotments />} />
            <Route path="products" element={<Products />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="stl" element={<STLViewer/>}/>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </>
      )}
    </Routes>
  );
}

export default Root;