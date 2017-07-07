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
 * NOTE: As of 2015-11-09 react-transform does not support a functional
 * component as the base compoenent that's passed to ReactDOM.render, so we
 * still use createClass here.
 */
export class App extends React.Component {
  static propTypes = {
    children: T.node,
    userId: T.number,
  };

  render() {
    return (
      <div className={cx('App')}>
        <nav className={cx('nav')}>
          <NavLink to='/' activeClassName={cx('active')} exact>Home</NavLink>
          <NavLink to='/user/123' activeClassName={cx('active')}>User 123</NavLink>
          <NavLink to={{ type: 'USER', payload: { id: 456 }}} activeClassName={cx('active')}>User 456</NavLink>
          <NavLink to='/about' activeClassName={cx('active')}>About</NavLink>
        </nav>
        {this.props.userId && (
          <div>
            <h1>User {this.props.userId}</h1>
            <p>Nothing much here yet</p>
          </div>
        )}
      </div>
    );
  }
}

const mapState = state => ({
  userId: state.userId,
});

const mapDispatch = dispatch => ({
  goToUser: () => dispatch({ type: 'USER', payload: { id: 5 } }),
});

export default connect(mapState, mapDispatch)(App);
