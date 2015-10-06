import React from 'react';
import request from 'request';
import imagesLoaded from 'imagesloaded';
import Velocity from 'velocity-animate';

import $ from '../framework/$.js';

// JSX
//import ArticleSummary from './article-summary.jsx';

var articleImages = {}

export default class Article extends React.Component {
  constructor(args) {
    super(args);

    this.state = {
      imageUrl: '',
      nextImageUrl: this.props.imageUrl,
      imageSlideInNeeded: true,
    }
  }

  componentWillMount() {
    this.loadImage();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.imageUrl != this.state.imageUrl) {
      this.setState({
        nextImageUrl: this.props.imageUrl,
      });

      this.loadImage();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.imageSlideInNeeded) this.slideIn();
  }

  getArticleContainer() {
    return React.findDOMNode(this.refs['article-content']);
  }

  slideOut(){
    if (!this.state.imageUrl) {
      this.setState({
        imageUrl: this.state.nextImageUrl,
        imageSlideInNeeded: true
      });
      return;
    }

    // If we've gottten to this point, we have to slide out the old artile to
    // make way for the new one.
    Velocity(this.getArticleContainer(), {
      left: '-100%'
    }, (elements) => {
      $(elements).css({ left: '100%' });

      // Set up the new article for rendering
      this.setState({
        imageUrl: this.state.nextImageUrl,
        imageSlideInNeeded: true
      });
    });
  }

  slideIn() {
    Velocity(this.getArticleContainer(), {
      left: '0'
    }, (elements) => {
      this.setState({
        imageSlideInNeeded: false,
      })
    });
  }

  loadImage() {
    let i = new Image();
    i.onload = () => {
      this.slideOut();
    }
    i.src = this.state.nextImageUrl;
  }

  render() {
    let className = `article`;
    let backgroundImageStyle = {
      backgroundImage: `url(${this.state.imageUrl})`
    }

    return (
      <div className={ className }>
        <div className='article-content' onClick={ this.handleClick } ref='article-content'>
          <div className='image-background' style={ backgroundImageStyle }></div>
          <div className='article-info'>
            <div className='headline'>
              { this.props.headline }
            </div>
          </div>
        </div>
        <div className='article-loading'>
          <i className='fa fa-spinner fa-spin'></i>
        </div>
      </div>
    )
  }
}

