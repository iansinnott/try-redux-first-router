import React from 'react';
import T from 'prop-types';
import { NavLink } from 'redux-first-router-link';
import classnames from 'classnames/bind';
import { connect } from 'react-redux';

// Using CSS Modules so we assign the styles to a variable
import s from './App.styl';
const cx = classnames.bind(s);
import logo from './react-logo.png';

// Favicon link is in the template, this just makes webpack package it up for us
import './favicon.ico';

export class Home extends React.Component {
  render() {
    return (
      <div className={cx('page')}>
        <div className={cx('siteTitle')}>
          <img src={logo} alt='React Logo' />
          <h1>React Static Boilerplate</h1>
        </div>
        <p>Why React static?</p>
        <ul>
          <li><span className={cx('hl')}>Dev</span> friendly</li>
          <li><span className={cx('hl')}>User</span> friendly</li>
          <li><span className={cx('hl')}>SEO</span> friendly</li>
        </ul>
      </div>
    );
  }
}

export class About extends React.Component {
  render() {
    return (
      <div className={cx('page')}>
        <div className={cx('siteTitle')}>
          <h1>About Page</h1>
        </div>
        <p>Welcome to the about page...</p>
      </div>
    );
  }
}

export class NotFound extends React.Component {
  render() {
    return (
      <div className={cx('page')}>
        <h4>Not found</h4>
      </div>
    );
  }
}

/**
 * Holy shit, for some reason I couldn't use Link components here. That was an
 * odd one...
 */
const UserIndex = () => (
  <nav className={cx('UserIndex')}>
    <h1>Users</h1>
    <NavLink to='/user/123'>User 123</NavLink>
    <NavLink to={{ type: 'USER', payload: { id: 456 }}}>User 456</NavLink>
  </nav>
);

const User = connect(state => ({
  userId: state.userId,
}))(props => (
  <div className={cx('User', 'page')}>
    {props.userId ? (
      <div>
        <h1>User {props.userId}</h1>
        <p>Nothing much here yet other than the fact that we are reading the user ID from state.</p>
        <p>
          <strong>User ID: </strong>
          <code>{props.userId}</code>
        </p>
      </div>
    ) : <UserIndex />}
  </div>
));

const Pages = {
  HOME: Home,
  ABOUT: About,
  USER: User,
};

/**
 * NOTE: As of 2015-11-09 react-transform does not support a functional
 * component as the base compoenent that's passed to ReactDOM.render, so we
 * still use createClass here.
 */
export class App extends React.Component {
  static propTypes = {
    children: T.node,
    page: T.string,
  };

  render() {
    const CurrentPage = Pages[this.props.page] || NotFound;
    return (
      <div className={cx('App')}>
        <nav className={cx('nav')}>
          <NavLink to='/' activeClassName={cx('active')} exact>Home</NavLink>
          <NavLink to='/user/' activeClassName={cx('active')}>Users</NavLink>
          {/* <NavLink to={{ type: 'USER' }} activeClassName={cx('active')}>Users</NavLink> */}
          <NavLink to={{ type: 'ABOUT' }} activeClassName={cx('active')}>About</NavLink>
        </nav>
        <div className='page'>
          <CurrentPage />
        </div>
      </div>
    );
  }
}

const mapState = state => ({
  page: state.page,
});

const mapDispatch = dispatch => ({
  goToUser: () => dispatch({ type: 'USER', payload: { id: 5 } }),
});

export default connect(mapState, mapDispatch)(App);
