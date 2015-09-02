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
    state = {
        data: []
    };

    render() {
        var sortedCopy = this.state.data.slice().sort(function(a, b) {
            return parseInt(b.visits) - parseInt(a.visits);
        });

        var articles = this.state.data.map(function(article, pos) {
            console.log(pos);
            let authors = "";
            if (article.authors && article.authors.length) {
                authors = article.authors.join(", ");
            }
            return (
                <Article
                    key={article.path}
                    visits={article.visits}
                    path={article.path}
                    title={article.title}
                    authors={authors}
                    position={pos*60} />
            );
        });
        return (
            <ol className="articleList">
                {articles}
            </ol>
        );
    };
};

/*
<ReactCSSTransitionGroup transitionName="example" transitionAppear={true}>
    {articles}
</ReactCSSTransitionGroup>
 */

class Article extends React.Component {
    constructor(props) {
        super(props);
    };

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.visits != nextProps.visits || this.props.position != nextProps.position;
    }

    render() {
        return (
          <li className='article' onClick={ this.handleClick } style={ {top: this.props.position+'px' } }>
            <ReactNumberEasing value={ this.props.visits } className='readers'/>
            <div className='article-title'>
              <div className='title'>
                <a target='_blank' href={ this.props.path }>{ this.props.title }</a>
              </div>
              <div className='info'>
                <div className={ this.props.authorsClass }>
                  { this.props.authors }
                </div>
                <div className='time'></div>
              </div>
            </div>
          </li>
        )
    };
};

