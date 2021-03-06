import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { delEducation } from '../../actions/profile';

const Education = ({ education, delEducation }) => {
	const educations = education.map((edu) => (
		<tr key={edu.id}>
			<td>{edu.school}</td>
			<td className="hide-sm">{edu.degree}</td>
			<td>
				<Moment format="YYYY/MM/DD">{edu.from}</Moment> -{' '}
				{edu.to === null ? (
					' Now'
				) : (
					<Moment format="YYYY/MM/DD">{edu.to}</Moment>
				)}
			</td>
			<td>
				<button className="btn btn-danger" onClick={() => delEducation(edu._id)}>Delete</button>
			</td>
		</tr>
	));

	return (
		<Fragment>
			<h2 className="my-2">Education Credentials</h2>
			<table className="table">
				<thead>
					<tr>
						<th>Company</th>
						<th className="hide-sm">Title</th>
						<th className="hide-sm">Years</th>
						<th></th>
					</tr>
				</thead>
				<tbody>{educations}</tbody>
			</table>
		</Fragment>
	);
};

Education.propTypes = {
	education: PropTypes.array.isRequired,
	delEducation: PropTypes.func.isRequired
};

export default connect(null, {delEducation})(Education);
