import axios from 'axios';
import {
	CLEAR_PROFILE,
	ACCOUNT_DELETED,
	GET_PROFILE,
	PROFILE_ERROR,
	UPDATE_PROFILE,
} from './types';
import { setAlert } from './alert';

export const getCurrentProfile = () => async (dispatch) => {
	try {
		const res = await axios.get('api/profile/me');

		dispatch({
			type: GET_PROFILE,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

// Create || Update Profile

export const createProfile =
	(formInput, history, edit = false) =>
	async (dispatch) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
				},
			};

			const res = await axios.post('api/profile', formInput, config);

			dispatch({
				type: GET_PROFILE,
				payload: res.data,
			});

			dispatch(
				setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success')
			);

			if (!edit) {
				history.push('/dashboard');
			}
		} catch (err) {
			const errors = err.response.data.errors;

			if (errors) {
				errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
			}

			dispatch({
				type: PROFILE_ERROR,
				payload: { msg: err.response.statusText, status: err.response.status },
			});
		}
	};

export const addExperience = (formData, history) => async (dispatch) => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const res = await axios.put('api/profile/experience', formData, config);

		dispatch({
			type: UPDATE_PROFILE,
			payload: res.data,
		});

		dispatch(setAlert('Education Profile Added', 'success'));

		history.push('/dashboard');
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
		}

		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: err.response.statusText,
				status: err.response.status,
			},
		});
	}
};

export const addEducation = (formData, history) => async (dispatch) => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const res = await axios.put('api/profile/education', formData, config);

		dispatch({
			type: UPDATE_PROFILE,
			payload: res.data,
		});

		dispatch(setAlert('Education Profile Added', 'success'));

		history.push('/dashboard');
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
		}

		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: err.response.statusText,
				status: err.response.status,
			},
		});
	}
};

// DELETE Experience

export const delExperience = (id) => async (dispatch) => {
	try {
		const res = await axios.delete(`api/profile/experience/${id}`);

		dispatch({
			type: UPDATE_PROFILE,
			payload: res.data,
		});

		dispatch(setAlert('Experience Removed', 'success'));
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: err.response.statusText,
				status: err.response.status,
			},
		});
	}
};

// Delete Education

export const delEducation = (id) => async (dispatch) => {
	try {
		const res = await axios.delete(`api/profile/education/${id}`);

		dispatch({
			type: UPDATE_PROFILE,
			payload: res.data,
		});

		dispatch(setAlert('Education Removed', 'success'));
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: err.response.statusText,
				status: err.response.status,
			},
		});
	}
};

// DELETE ACCOUNT

export const delAccount = () => async (dispatch) => {
	if (window.confirm('Are you sure')) {
		try {
			// eslint-disable-next-line no-unused-vars
			const res = await axios.delete(`api/profile`);

			dispatch({
                type: CLEAR_PROFILE
			});
			dispatch({ type: ACCOUNT_DELETED });
			dispatch(setAlert('Account Removed'));
		} catch (err) {
			dispatch({
				type: PROFILE_ERROR,
				payload: {
					msg: err.response.statusText,
					status: err.response.status,
				},
			});
		}
	}
};
