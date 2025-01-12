import React from "react";
import "./Navbar.css"; // Import your custom CSS file
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sprout } from "lucide-react";


// Import Font Awesome Icons
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPalette,
  faImages,
  faThumbtack,
  faHeart,
  faChartLine,
  faFire,
  faMagic,
  faGem,
  faCaretUp,
  faHouse,
  faCreditCard
} from "@fortawesome/free-solid-svg-icons";
import { faCodepen, faRocketchat } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Add the icons to the library
library.add(
  faPalette,
  faImages,
  faThumbtack,
  faHeart,
  faChartLine,
  faFire,
  faMagic,
  faGem,
  faCodepen,
  faCaretUp,
  faHouse,
  faCreditCard,
  faRocketchat

);

const Navbar = ({ setExpanded }) => {

  const [user, setUser] = useState(null);

    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await fetch("http://localhost:8000/user/userData", {
            method: "GET",
            credentials: "include",
          });
  
          if (response.ok) {
            const data = await response.json();
            // console.log("User data:", data);
            setUser(data.user);
          }
        } catch (error) {
          console.log("Network error:", error);
        }

      };
      fetchUserData();
    }, [user?._id]);

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      // Send a logout request to the backend to clear the cookie
      const response = await fetch("http://localhost:8000/user/logout", {
        method: "GET",
        credentials: "include", // Ensure cookies are sent with the request
      });

      const data = await response.json();
      if (data.message === "Logged out successfully") {
        // Redirect to login page after successful logout
        navigate("/aboutUs");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  return (
    <div id="nav-bar">
      {/* Toggle Checkbox for Responsive Navbar */}
      <input id="nav-toggle" type="checkbox" />

      {/* Header Section */}
      <div id="nav-header">
        {/* Navbar Title with Icon */}
        <a id="nav-title" target="_blank" rel="noopener noreferrer">
          <div className="flex flex-row ml-3">

        Sp<Sprout className="h-5 w-5 mt-2.5" />outUp
        </div>
        </a>

        {/* Hamburger Menu for Mobile */}
        <label
          htmlFor="nav-toggle"
          id="nav-toggle-label"
          onClick={() => setExpanded((prev) => !prev)}
        >
          <span id="nav-toggle-burger"></span>
        </label>
        <hr />
      </div>

      {/* Navigation Content */}
      <div id="nav-content">
        {/* Navigation Buttons */}
        <NavButton
          icon="fa-solid fa-house"
          text="Home"
          onClick={() => {
            navigate("/home");
          }}
        />
        <NavButton
          icon="fa-brands fa-rocketchat"
          text="ChatBot"
          onClick={() => {
            navigate("/chatBot");
          }}
        />
        <NavButton
          icon="fa-solid fa-credit-card"
          text="Carbon Credit"
          onClick={() => {
            navigate("/market");
          }}
        />
        <hr />
        {/* <NavButton icon="heart" text="WatchList" />
        <NavButton icon="chart-line" text="Trending" />
        <NavButton icon="fire" text="Challenges" />
        <NavButton icon="magic" text="Spark" />
        <hr /> */}
        <NavButton
          icon="gem"
          text="My Footprint"
          onClick={() => {
            navigate("/footprint");
          }}
        />

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
              {user?.fullName}
            </a>
            <span id="nav-footer-subtitle">{user?.role}</span>
          </div>

          {/* Footer Toggle Icon */}
          <label htmlFor="nav-footer-toggle">
            <FontAwesomeIcon icon="caret-up" className="fas fa-caret-up" />
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
      <FontAwesomeIcon icon={icon} className="fas fa-palette" />
      <span>{text}</span>
    </div>
  );
};

export default Navbar;