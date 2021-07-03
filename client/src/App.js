import { Fragment, useEffect } from 'react';
import Navbar from './components/layouts/Navbar';
import Landing from './components/layouts/Landing';
import Login from './auth/Login';
import Register from './auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile-form/CreateProfile';
import './App.css';
import PrivateRoute from './components/routing/PrivateRoute';
// Redux
import { Provider } from 'react-redux';
import store from './store';
import Alert from './components/Alert';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import EditProfile from './components/profile-form/EditProfile';
import AddExperience from './components/profile-form/AddExperience';
import AddEducation from './components/profile-form/AddEducation';

if (localStorage.token) {
	setAuthToken(localStorage.token);
}

const App = () => {
	useEffect(() => {
		store.dispatch(loadUser());
	}, []);

	return (
		<Provider store={store}>
			<Router>
				<Fragment>
					<Navbar />
					<Route exact path="/" component={Landing} />
					<section className="container">
						<Alert />
						<Switch>
							<Route exact path="/register" component={Register} />
							<Route exact path="/login" component={Login} />
							<PrivateRoute exact path="/dashboard" component={Dashboard} />
							<PrivateRoute exact path="/create_profile" component={CreateProfile} />
							<PrivateRoute exact path='/edit-profile' component={EditProfile} />
							<PrivateRoute exact path='/add-experience' component={AddExperience} />
							<PrivateRoute exact path='/add-education' component={AddEducation} />
						</Switch>
					</section>
				</Fragment>
			</Router>
		</Provider>
	);
};
export default App;
