import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch } from "react-redux";
import { logout } from "../../store/session";
// import OpenModalButton from "../OpenModalButton";
// import LoginFormModal from "../LoginFormModal";
// import SignupFormModal from "../SignupFormModal";
import { useNavScroll } from "../../context/NavScrollToggle";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const { scrollTop } = useNavScroll()


  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current || !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const handleLogout = (e) => {
    console.log('logoutclicked')
    e.preventDefault();
    dispatch(logout());
    closeMenu()
    history.push('/')
  };

  function containerToggle() {
    if (scrollTop >= 10) {
      return "-active"
    } else {
      return ''
    }
  }

  const closeMenu = () => setShowMenu(false);
  const ulClassName = "profile-drop" + (showMenu ? "" : " hidden");

  return (
    <>
      {!user ? (
        <NavLink exact to="/slider" className="logSignUp-button-container">
          <button className={`logSignUp-button${containerToggle()}`}>
            LogIn / SignUp
          </button>
        </NavLink>
      ) : (
        <button onClick={(e) => openMenu(e)} className="profile-button">
          <img src={user.profile_pic} className="mini-profile" alt='user_profile_pic'></img>
        </button>
      )}

      <ul className={ulClassName} ref={ulRef}>
        {user && (
          <>
            <div className="profile_dropdown_user">
              {/* <div className="profile_dropdown_left">
                <img src={user.profile_pic} className="mini-profile" alt='user_profile_pic'></img>
              </div> */}
              <div className="profile_dropdown_right">
                {/* <li>Welcome, {user.username}</li> */}
                <div className="user_first_last">{user.first_name} {user.last_name}</div>
                <li style={{ color: "gray" }}>{user.email}</li>
              </div>
            </div>
            {user.student &&
              <div className="view-dash-container">
                <li>
                  <NavLink onClick={(e) => closeMenu()} exact to="/mytours" className="view-dash-button"><i className="fa-solid fa-flag"></i>My Tours</NavLink>
                </li>
                {/* <div className="right-arrow">{`>`}</div> */}
              </div>
            }
            <div className="view-dash-container">
              <li>
                <NavLink onClick={(e) => closeMenu()} exact to="/mybookings" className="view-dash-button"><i className="fa-solid fa-book"></i>My Bookings</NavLink></li>
              {/* <div className="right-arrow">{`>`}</div> */}
            </div>
            {/* <li>
              <NavLink onClick={closeMenu} exact to="/dashboard" className="view-dash-button">Dashboard</NavLink></li> */}
            <div className="view-dash-container">
              <li onClick={(e) => handleLogout(e)} className="view-dash-button" ><i className="fa-solid fa-right-from-bracket"></i>Log Out</li>
              {/* <div className="right-arrow">{`>`}</div> */}
            </div>

          </>
        )
          // : (
          //   <>
          //     <div className="view-logout-container">
          //       <OpenModalButton
          //         buttonText="Log In"
          //         onItemClick={closeMenu}
          //         modalComponent={<LoginFormModal />}
          //         id={'log-in-button'}
          //       />

          //       <OpenModalButton
          //         buttonText="Sign Up"
          //         onItemClick={closeMenu}
          //         modalComponent={<SignupFormModal />}
          //         id={'sign-up-button'}
          //       />
          //     </div>
          //   </>
          // )
        }
      </ul >
    </>
  );
}

export default ProfileButton;
