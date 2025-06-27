import React from 'react';
import SearchBar from './searchBar';

const Navbar = ({ events, onFilter }) => {
  return (
    <nav className="navbar bg-primary text-white">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <a className="navbar-brand text-white d-flex align-items-center" href="#">
          <img src="calender icon.png" alt="Calendar Icon" width="30" height="30" className="me-2" />
          Custom Event Calender
        </a>
         {/* SearchBar component */}
        <SearchBar events={events} onFilter={onFilter} />
      </div>
    </nav>
  );
};

export default Navbar;
