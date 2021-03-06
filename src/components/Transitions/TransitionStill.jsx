import React from 'react';
import './TransitionStill.css';
import { Header } from 'semantic-ui-react';

const TransitionActive = props => (
  <div className="LoaderContainer">
    <Header as="h2" textAlign="center">
      No data to display...
    </Header>
    <Header as="h4" textAlign="center">
      Please select a {props.stillMessage} to your left
    </Header>
    <div className="transition-still-loader">
      <div className="transition-still-dot"></div>
      <div className="transition-still-dot"></div>
      <div className="transition-still-dot"></div>
      <div className="transition-still-dot"></div>
      <div className="transition-still-dot"></div>
      <div className="transition-still-dot"></div>
      <div className="transition-still-dot"></div>
      <div className="transition-still-dot"></div>
      <div className="transition-still-dot"></div>
      <div className="transition-still-spec"></div>
      <div className="transition-still-shadow"></div>
    </div>
  </div>
);

export default TransitionActive;
