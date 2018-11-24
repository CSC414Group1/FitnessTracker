import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Header extends Component {
  renderContent() {
    //this is going through showing is a user is logged in or not based on the props
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return <li><a href="/auth/google">Login With Google</a></li>;
      default:
        return <li key="2"><a href="/api/logout">Logout</a></li>
    }
  }

  render() {
    //if you click the link which is the name of the app takes the user back to the homepage
    return (
      <nav>
        <div className="nav-wrapper orange accent-2">
          <Link
            to={this.props.auth ? '/loginhome' : '/'}
            className="center brand-logo"
          >
            Fitness Tracker
          </Link>
          <ul className="right">
            {this.renderContent()}
          </ul>
        </div>
      </nav>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

//this is connectiong the state with redux
export default connect(mapStateToProps)(Header);
