import React from 'react';
import { Link } from 'react-router-dom';
import SurveyList from './surveys/SurveyList';

const LoginHome = () => {
  return (
    <div>
      <SurveyList />
      <div className="fixed-action-btn">
        <Link to="/surveys/new" className="btn-floating btn-large orange accent-2">
          <i className="material-icons">add</i>
        </Link>
      </div>
    </div>
  );
};

export default LoginHome;
