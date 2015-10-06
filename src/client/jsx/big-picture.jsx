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
      imageUrl: this.props.imageUrl,
      nextImageUrl: '',
      imageLoading: true
    }
  }

  componentWillMount() {
    this.loadImage();
  }

  getArticleContainer() {
    return React.findDOMNode(this.refs['article-content']);
  }

  slideIn() {
    Velocity(this.getArticleContainer(), {
      left: '0'
    });
  }

  hasNextArticle() {
    // Checks to see if we 1) have a 'next' property, 2) this.props.next isn't
    // undefined and 3) this.props.next.imageUrl exists
    return ('next' in this.props) && this.props.next && ('imageUrl' in this.props.next);
  }

  loadImage() {
    let i = new Image();

    i.onload = () => {
      this.setState({
        imageUrl: i.src,
        imageLoading: false
      });

      this.slideIn();
    }

    i.src = this.state.imageUrl;
  }

  render() {
    let className = `article ${ this.state.imageLoading ? 'loading' : '' }`;
    let backgroundImageStyle = {
      backgroundImage: `url(${this.props.imageUrl})`
    }

    // Check if there's a new image we should be loading
    let imageLink = ''
    // This is for loading new articles
    if (this.hasNextArticle()) {
      imageLink = this.props.next.imageUrl;
    }
    // This is for the first time rendering
    else {
      imageLink = this.props.imageUrl;
    }

    return (
      <div className={ className }>
        <div className='article-content' onClick={ this.handleClick } ref='article-content'>
          <img className='image-to-load' src={ imageLink }/>
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

//var Article__ = React.createClass({
  //getDefaultProps() {
    //return {
      //imageUrl: '',
      //loading: true,
      //next: undefined,
      //summary: undefined,
      //readers: 0,
    //}
  //},
  //handleClick() {
    //var data = {
      //url: this.props.article.path,
      //title: this.props.article.title,
      //article: this
    //}

    //this.setProps({ summary: new ArticleSummary(data, 'summary-container') });
  //},
  //loadImage() {
    //// set up the imagesLoaded callback
    //imagesLoaded($(this.getDOMNode()).find('.image-to-load'), () => {
      //this.slideOut();
    //});
  //},
  //slideOut() {

    //// If we don't have a new image to load (i.e. this is the first image being
    //// loaded) just say we're done loading the image and return
    //if (!this.hasNextArticle()) {
      //this.setProps({
        //next: undefined,
        //loading: false
      //});
      //return;
    //}

    //// If we've gottten to this point, we have to slide out the old artile to
    //// make way for the new one.
    //Velocity(this.getArticleContainer(), {
      //left: '-100%'
    //}, (elements) => {
      //$(elements).css({ left: '100%' });
      //let next = this.props.next;

      //// Set up the new article for rendering
      //this.setProps({
        //next: undefined,
        //loading: false,
        //imageUrl: next.imageUrl,
        //article: next.article
      //});
    //});
  //},
  //componentDidMount() {
    //this.loadImage();
  //},
  //componentWillReceiveProps(nextProps) {
    //if (nextProps.loading) {
      //this.loadImage();
    //}
  //},
  //componentDidUpdate(prevProps, prevState) {

    //// Slide in the element if we're now done loading the image
    //if (!this.props.loading && prevProps.loading) {
      //this.slideIn();
    //}

    //// If we're receiving a new article and it's a new image, load the image
    //// Wait until the image is drawn to the DOM before calling this.loadImage
    ////
    //// ONly do this if we're not currently loading an image
    //if (!this.props.loading && this.hasNextArticle() && (this.props.next.imageUrl != this.props.imageUrl)) {
      //this.setProps({
        //loading: true
      //});
    //}
  //},
  //renderNewArticle(article, imageUrl) {
    //this.setProps({
      //next: {
        //article,
        //imageUrl
      //}
    //});
  //},
//});

