import React from "react";
import "./Navbar.css"; // Import your custom CSS file
import { useNavigate } from "react-router-dom";

// Import Font Awesome Icons
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPalette, faImages, faThumbtack, faHeart, faChartLine, faFire, faMagic, faGem, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { faCodepen } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Add the icons to the library
library.add(faPalette, faImages, faThumbtack, faHeart, faChartLine, faFire, faMagic, faGem, faCodepen, faCaretUp);

const Navbar = () => {
      const navigate = useNavigate();
      const handleLogout = async () => {
        try {
          // Send a logout request to the backend to clear the cookie
          const response = await fetch('http://localhost:8000/user/logout', {
            method: 'GET',
            credentials: 'include', // Ensure cookies are sent with the request
          });
    
          const data = await response.json();
          if (data.message === 'Logged out successfully') {
            // Redirect to login page after successful logout
            navigate('/login');
          } else {
            console.error('Logout failed');
          }
        } catch (error) {
          console.error('Error during logout:', error);
        }
      };
  return (
    <div id="nav-bar">
      {/* Toggle Checkbox for Responsive Navbar */}
      <input id="nav-toggle" type="checkbox" />

      {/* Header Section */}
      <div id="nav-header">
        {/* Navbar Title with Icon */}
        <a
          id="nav-title"
          target="_blank"
          rel="noopener noreferrer"
        >
          C<FontAwesomeIcon icon={["fab", "codepen"]} />DEPEN
        </a>

        {/* Hamburger Menu for Mobile */}
        <label htmlFor="nav-toggle">
          <span id="nav-toggle-burger"></span>
        </label>
        <hr />
      </div>

      {/* Navigation Content */}
      <div id="nav-content">
        {/* Navigation Buttons */}
        <NavButton icon="palette" text="Home" onClick={() => { navigate('/home') }}/>
        <NavButton icon="images" text="ChatBot" onClick={() => { navigate('/home') }}/>
        <NavButton icon="thumbtack" text="Carbon Credit" onClick={() => { navigate('/market') }}/>
        <NavButton icon="thumbtack" text="Your Contribution" onClick={() => { navigate('/market/orders/') }}/>
        <hr />
        <NavButton icon="heart" text="WatchList" />
        <NavButton icon="chart-line" text="Trending" />
        <NavButton icon="fire" text="Challenges" />
        <NavButton icon="magic" text="Spark" />
        <hr />
        <NavButton icon="gem" text="Codepen Pro" />

        {/* Highlight Background */}
        <div id="nav-content-highlight"></div>
      </div>

      {/* Footer Section */}
      <input id="nav-footer-toggle" type="checkbox" />
      <div id="nav-footer">
        <div id="nav-footer-heading">
          {/* Avatar */}
          <div id="nav-footer-avatar">
            <img
              src="https://gravatar.com/avatar/4474ca42d303761c2901fa819c4f2547"
              alt="Avatar"
            />
          </div>

          {/* Footer Title */}
          <div id="nav-footer-titlebox">
            <a
              id="nav-footer-title"
              href="https://codepen.io/uahnbu/pens/public"
              target="_blank"
              rel="noopener noreferrer"
            >
              uahnbu
            </a>
            <span id="nav-footer-subtitle">Admin</span>
          </div>

          {/* Footer Toggle Icon */}
          <label htmlFor="nav-footer-toggle">
            <FontAwesomeIcon icon="caret-up" className="fas fa-caret-up"/>
          </label>
        </div>

        {/* Footer Content */}
        <div id="nav-footer-content overflow-y-hidden">
        <div
            className="flex justify-center border border-white bg-white text-green-600 py-1.5 rounded-md mx-4 my-1 text-sm cursor-pointer"
            onClick={handleLogout} // Logout on click
          >
            LogOut
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable NavButton Component
const NavButton = ({ icon, text, onClick }) => {
  return (
    <div className="nav-button" onClick={onClick}>
      <FontAwesomeIcon icon={icon} className="fas fa-palette"/>
      <span>{text}</span>
    </div>
  );
};

export default Navbar;