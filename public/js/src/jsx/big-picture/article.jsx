import $ from '../../framework/_$.js';
import React from 'react';
import request from 'request';
import imagesLoaded from 'imagesloaded';
import Velocity from 'velocity-animate';

// JSX
import ArticleSummary from '../article-summary.jsx';

var articleImages = {}

var Article = React.createClass({
  getDefaultProps() {
    return {
      imageUrl: '',
      loading: true,
      next: undefined,
      summary: undefined,
      readers: 0,
    }
  },
  handleClick() {
    var data = {
      url: this.props.article.path,
      title: this.props.article.title,
      article: this
    }

    this.setProps({ summary: new ArticleSummary(data, 'summary-container') });
  },
  getArticleContainer() {
    var domNode = $(this.getDOMNode());
    return domNode.find('.article-content')[0];
  },
  loadImage() {
    // set up the imagesLoaded callback
    // imagesLoaded($(this.getDOMNode()).find('.image-to-load'), () => {
      this.setProps({
        loading: false
      });
    // });
  },
  slideOut() {
    Velocity(this.getArticleContainer(), {
      left: '-100%'
    }, (elements) => {
      $(elements).css({ left: '100%' });
      let next = this.props.next;

      this.setProps({
        next: undefined,
        imageUrl: next.imageUrl,
        article: next.article,
        loading: true
      });
    });
  },
  slideIn() {
    Velocity(this.getArticleContainer(), {
      left: '0'
    });
  },
  componentDidMount() {
    this.loadImage();
  },
  componentWillReceiveProps(nextProps) {

    // Once we're done loading the pcitures and we flushed everything to the
    // DOM, slide the article in
    if (!nextProps.loading && this.props.loading) {
      this.slideIn();
    }

    // If we've received a new article, slide out
    if (!this.props.next && !!nextProps.next) {
      this.slideOut();
    }
  },
  componentDidUpdate(prevProps, prevState) {
    // If we've got a new imageUrl, load the image
    if ((this.props.imageUrl !== prevProps.imageUrl) && !!this.props.imageUrl) {
      this.loadImage();
    }
  },
  renderNewArticle(article, imageUrl) {
    this.setProps({
      next: {
        article,
        imageUrl
      }
    });
  },
  render() {
    let className = 'article';
    let backgroundImageStyle = {};
    if (this.props.loading) {

      // Show the DOM element
      className += ' loading';
    }
    else {
      // Only add the image after it's done loading
      backgroundImageStyle = {
        backgroundImage: `url(${this.props.imageUrl})`
      }
    }

    return (
      <div className={ className }>
        <div className='article-content' onClick={ this.handleClick }>
          <img className='image-to-load' src={this.props.imageUrl}/>
          <div className='image-background' style={ backgroundImageStyle }></div>
          <div className='article-info'>
            <div className='title'>
              { this.props.article.title }
            </div>
            <div className='byline'>
              { this.props.article.authors.join(', ') }
            </div>
          </div>
        </div>
        <div className='article-loading'>
          <i className='fa fa-spinner fa-spin'></i>
        </div>
      </div>
    )
  }
});

module.exports = function(data, id) {

  return React.render(
    <Article article={ data.article } imageUrl={ data.imageUrl }/>,
    document.getElementById(id)
  )
}