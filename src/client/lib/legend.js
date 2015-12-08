"use strict";

import React from 'react';
import { getHost } from './parse';

export default class Legend extends React.Component {
  constructor(props) { super(props); };
  render() {
    let legend = [];
    for (let i = 0; i < this.props.sites.length; i++) {
      let site = this.props.sites[i];
      let name = site;
      let className = site;

      if (typeof site === "object") {
        if (site.name) {
          name = site.name;
          className = site.name;
        }

        if (site.domain) {
          className = site.domain.replace(/\.\w+$/, '');
        }
      }

      className += " swatch";

      legend.push(
        <div className="source">
          <div className={ className }></div>
          <p>{ name }</p>
        </div>
      );
    }

    return <div className="legend">{ legend }</div>;
  };
}
