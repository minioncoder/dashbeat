'use strict';

import React from 'react';
import addons from 'react/addons';
const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
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
        // we must preserve the original order in which the articles
        // are generated in the DOM or else react will destroy/recreate those
        // elements and lose its previous state
        var sortedCopy = this.state.data.slice().sort(function(a, b) {
            return a.path.localeCompare(b.path);
        });

        let articles = [];

        for (let i = 0; i < sortedCopy.length; i++) {
            let article = sortedCopy[i];
            let authors = "";
            let id = /\/(\d+)\/$/.exec(article.path);
            if (!id) continue;

            if (article.authors && article.authors.length) {
                authors = article.authors.join(", ");
            }

            let pos = this.state.data.indexOf(article);

            let art = <Article key={ article.path }
                visits={ article.visits }
                path={ article.path }
                title={ article.title }
                authors={ authors }
                position={ pos } />;

            if (articles.indexOf(art) == -1)
                articles.push(art);
        }

        return (
            <ol className="articleList">
                <ReactCSSTransitionGroup transitionName="example" transitionAppear={true}>
                    {articles}
                </ReactCSSTransitionGroup>
            </ol>
        );
    };
};

class Article extends React.Component {
    constructor(props) {
        super(props);
    };

    render() {
        return (
          <li className='article' style={ {top: (this.props.position*60)+'px'} }>
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
