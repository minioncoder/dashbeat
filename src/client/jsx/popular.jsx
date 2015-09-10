'use strict';

import React from 'react';
import addons from 'react/addons';
const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
import { getData, Overview } from './overview.jsx';

export default function renderList(data, el) {
    return React.render(
        <ArticleList data={data} />,
        el
    );
}

class ArticleList extends React.Component {
    state = {
      freeze: false,
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
            let re_id = /\/(\d+)\/$/.exec(article.path);
            if (!re_id.length) continue;
            let id = re_id[1];

            if (article.authors && article.authors.length) {
                authors = article.authors.join(", ");
            }

            let pos = this.state.data.indexOf(article);

            let art = <Article key={ id }
                id={ id }
                visits={ article.visits }
                path={ article.path }
                title={ article.title }
                authors={ authors }
                position={ pos } />;

            if (articles.indexOf(art) == -1) {
                articles.push(art);
            }
        }

        return (
          <div>
            <button type="button" id="articleFreeze" onClick={ this.freeze.bind(this) }>Freeze</button>
            <ol className="articleList">
                <ReactCSSTransitionGroup transitionName="animate-article" transitionAppear={true}>
                    {articles}
                </ReactCSSTransitionGroup>
            </ol>
          </div>
        );
    };

    shouldComponentUpdate(nextProps, nextState) {
      return !nextState.freeze;
    };

    freeze(ev) {
      this.setState({ freeze: !this.state.freeze });
    };
};

class Article extends React.Component {
    constructor(props) {
      super(props);
    };

    state = {
      data: {},
      hasData: false,
      open: false
    };

    async handleClick() {
      if (!this.state.hasData) {
        try {
          let data = await getData(this.props.id);
          this.setState({ hasData: true, open: true, data });
          return;
        } catch (err) {
          throw err;
        }
      }

      this.setState({ open: true });
    }

    closeOverview(e) {
      e.stopPropagation();
      this.setState({ open: false });
    }

    render() {
      return (
        <li className='article' onClick={ this.handleClick.bind(this) } style={ {top: (this.props.position*60)+'px'} }>
          <div className='readers'>{ this.props.visits }</div>
          <a className='title' target='_blank' href={ this.props.path }>{ this.props.title }</a>
          <div className='info'>{ this.props.authors }</div>

          <Overview key={ this.props.id }
            visits={ this.props.visits }
            hasData={ this.state.hasData }
            open={ this.state.open }
            close={ this.closeOverview.bind(this) }
            data={ this.state.data } />
        </li>
      );
    };
}
