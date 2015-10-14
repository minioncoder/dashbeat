import React from 'react';
import request from 'request';
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
      headline: this.props.headline,
      url: this.props.url,
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
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.nextImageUrl && this.state.nextImageUrl != prevState.nextImageUrl) this.loadImage();
    else if (this.state.imageSlideInNeeded) this.slideIn();
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
        headline: this.props.headline,
        url: this.props.url,
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
        nextImageUrl: '',
      })
    });
  }

  loadImage() {
    console.log('loading image');
    let i = new Image();
    i.onload = this.slideOut.bind(this);
    i.src = this.state.nextImageUrl;
  }

  render() {
    let className = `article`;
    let backgroundImageStyle = {
      backgroundImage: `url(${this.state.imageUrl})`
    }

    return (
      <div className={ className }>
        <a href={ this.state.url } target='_blank'>
          <div className='article-content' ref='article-content'>
            <div className='image-background' style={ backgroundImageStyle } key={ this.state.article_id }></div>
            <div className='article-info'>
              <div className='headline'>
                { this.state.headline }
              </div>
            </div>
          </div>
        </a>
        <div className='article-loading'>
          <i className='fa fa-spinner fa-spin'></i>
        </div>
      </div>
    )
  }
}

