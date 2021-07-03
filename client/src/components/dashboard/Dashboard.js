import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { delAccount, getCurrentProfile } from '../../actions/profile';
import Spinner from '../layouts/Spinner';
import DbAction from './DbAction';
import Experience from './Experience';
import Education from './Education';

const Dashboard = ({
	delAccount,
	getCurrentProfile,
	auth: { user },
	profile: { profile, loading },
}) => {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => getCurrentProfile(), []);
	return loading && profile === null ? (
		<Spinner />
	) : (
		<Fragment>
			<h1 className="large text-primary">Dashboard</h1>
			<p className="lead">
				<i className="fas fa-user" /> Welcome {user && user.name}
			</p>
			{profile !== null ? (
				<Fragment>
					<DbAction />
					<Experience experience={profile.experience} />
					<Education education={profile.education} />

					<div className="my-2">
						<button
							value="Delete Account"
							onClick={() => delAccount()}
							className="btn btn-danger"
						>
							<i className="fa fa-trash " />{' '}
							Delete Account
						</button>
					</div>
				</Fragment>
			) : (
				<Fragment>
					<p>
						You have not created any profile yet{' '}
						<Link to="/create_profile" className="btn btn-primary my-1">
							Create Profile
						</Link>
					</p>
				</Fragment>
			)}
		</Fragment>
	);
};

Dashboard.propTypes = {
	auth: PropTypes.object.isRequired,
	delAccount: PropTypes.func.isRequired,
	getCurrentProfile: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	profile: state.profile,
});

export default connect(mapStateToProps, { delAccount, getCurrentProfile })(
	Dashboard
);
