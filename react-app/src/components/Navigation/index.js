import React from "react";
import { NavLink } from 'react-router-dom';
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import logo from '../../images/logo.png'
import white_logo from '../../images/white_logo.png'
import { useNavScroll } from "../../context/NavScrollToggle";
import { useLocation } from "react-router-dom/";

function Navigation({ isLoaded }) {
	const sessionUser = useSelector((state) => state.session.user);
	const { scrollTop } = useNavScroll()
	const location = useLocation()

	function containerToggle() {
		if (location.pathname !== '/') {
			return '-notmain'
		} else {
			if (scrollTop >= 10) {
				return "-active"
			} else {
				return ''
			}
		}
	}

	function logoToggle() {
		if (location.pathname !== '/') {
			return logo
		} else {
			if (scrollTop >= 10) {
				return logo
			} else {
				return white_logo
			}
		}
	}


	return (
		<div className={`nav-big-container${containerToggle()}`}>
			<div className="nav-container">
				<div className="nav-left">
					<NavLink exact to="/">
						<img className="small-logo" src={logoToggle()} alt="" />
					</NavLink>
				</div>
				{isLoaded && (
					<div>
						<ProfileButton user={sessionUser} />
					</div>
				)}
			</div>
		</div>
	);
}

export default Navigation;
