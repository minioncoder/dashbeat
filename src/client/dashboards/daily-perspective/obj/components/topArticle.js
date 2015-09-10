import React from 'react';

export default class TopArticle extends React.component {

  render() {
    return(
      <div className='top-article'>
        <div className='article-title'>{ this.props.data.data.title }</div>
      </div>
    )
  }
}
