'use strict';

import React from 'react';
//import ReactNumberEasing from 'react-number-easing';

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
            var visitsA = parseInt(a.visits);
            var visitsB = parseInt(b.visits);

            if (visitsA == visitsB) {
                return a.title.localeCompare(b.title);
            }
            return visitsB - visitsA;
        });

        var articles = sortedCopy.map(article => {
            let authors = "";
            let id = /\/(\d+)\/$/.exec(article.path);
            if (!id) return;

            if (article.authors && article.authors.length) {
                authors = article.authors.join(", ");
            }

            let pos = this.state.data.indexOf(article);

            return <Article key={ id[1] }
                visits={ article.visits }
                path={ article.path }
                title={ article.title }
                authors={ authors }
                position={ pos }
                style={ {top: (pos*60)+'px' } } />
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

    render() {
        return (
          <li className='article' style={ this.props.style }>
            <div className='readers'>{ this.props.visits }</div>
            <div className='article-title'>
              <div className='title'>
                <a target='_blank' href={ this.props.path }>{ this.props.title }</a>
              </div>
              <div className='info'>
                { this.props.authors }
              </div>
            </div>
          </li>
        );
    };
}
