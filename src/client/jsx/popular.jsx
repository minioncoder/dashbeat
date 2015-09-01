'use strict';

import React from 'react';
import ReactNumberEasing from 'react-number-easing';

export default function renderList(data, el) {
    return React.render(
        <ArticleList data={data} />,
        el
    );
}

class ArticleList extends React.Component {
    render() {
        var articles = this.props.data.map(function(article) {
            return (
                <Article visits={article.visits} path={article.path} title={article.title} authors={article.authors} />
            );
        });
        return (
            <div className="articleList">
                {articles}
            </div>
        );
    };
};

class Article extends React.Component {
    constructor(props) {
        super(props);
        this.props.authorsClass = 'authors';
        if (!this.props.authors.length) {
            this.props.authorsClass = 'hidden';
        }
    };

    render() {
        return (
          <div className='article' onClick={ this.handleClick }>
            <ReactNumberEasing value={ this.props.visits } className='readers'/>
            <div className='article-title'>
              <div className='title'>
                <a target='_blank' href={ this.props.path }>{ this.props.title }</a>
              </div>
              <div className='info'>
                <div className={ this.props.authorsClass }>
                  { this.props.authors.join(', ') }
                </div>
                <div className='time'></div>
              </div>
            </div>
          </div>
        )
    };
};

/*module.exports = {
    Article, ArticleList
};*/
