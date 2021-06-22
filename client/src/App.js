import { Fragment, useEffect } from 'react';
import Navbar from './components/layouts/Navbar';
import Landing from './components/layouts/Landing';
import Login from './auth/Login';
import Register from './auth/Register';
import './App.css';
// Redux
import { Provider } from 'react-redux';
import store from './store';
import Alert from './components/Alert';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

if (localStorage.token) {
	setAuthToken(localStorage.token);
}

const App = () => {

	useEffect( () => store.dispatch(loadUser()), [])

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
						</Switch>
					</section>
				</Fragment>
			</Router>
		</Provider>
	);
}
export default App;
