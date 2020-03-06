import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import App from './App';
import Login from './components/Login';
import Admin from './components/Admin';

const Root = () => {
    return (
        <Router>
            <div>
                <Route path="/" exact component={App} />
                <Route path="/login" component={Login} />
                <Route path="/admin" component={Admin} />
            </div>
        </Router>
    )
}

ReactDOM.render(<Root />, document.getElementById('root'));