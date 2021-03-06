import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
	const authLinks = (
		<ul>
			<li>
				<Link to="/dashboard">
					<i className="fa fa-user"></i>
					<span className="hide-sm"> Dashboard</span>
				</Link>
			</li>
			<li>
				<Link onClick={logout} to="#!">
					<i className="fa fa-sign-out"></i> <span className="hide-sm">Logout</span>
				</Link>
			</li>
		</ul>
	);

	const guestLinks = (
		<ul>
			<li>
				<a href="#!">Developers</a>
			</li>
			<li>
				<Link to="/register">Register</Link>
			</li>
			<li>
				<Link to="/login">Login</Link>
			</li>
		</ul>
	);

	return (
		<Fragment>
			<nav className="navbar bg-dark">
				<h1>
					<Link to="/">
						<i className="fas fa-code"></i> DevConnector
					</Link>
				</h1>
				{!loading && (
					<Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
				)}
			</nav>
		</Fragment>
	);
};
Navbar.propTypes = {
	logout: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProp, { logout })(Navbar);
