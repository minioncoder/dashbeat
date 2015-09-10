import React from 'react';
import numeral from 'numeral';

export default class StatListItem extends React.Component {
  /**
   * @constructs
   *
   * Data from a the report_api Chartbeat API. Expects an object in the followin
   * format:
   *  {
   *    previous: {Number},     // Previous day's value
   *    num: {Number},          // Today's value,
   *    significant: {Boolean}, // idk why this is a thing
   *    delta: {Number}         // % change from yesterday (decimal; e.g. 0.1 === 10%)
   *  }
   */
  constructor(args) {
    super(args);

    this.deltaDirection = this.props.data.delta > 0 ? 'positive' : 'negative';
    this.state = {
      showPopup: false
    };
  }

  showPopup(e) {
    if (/delta|number/.test(e.target.className)) {
      this.setState({ showPopup: true });
    }
  }

  hidePopup(e) {
    this.setState({ showPopup: false });
  }

  render() {
    let popupClass = `popup ${this.deltaDirection}`;
    if (this.state.showPopup) popupClass += ' show';

    let percentageText = `${(this.props.data.delta * 100).toFixed(2)}%`;
    let number = numeral(this.props.data.num).format('0,0');

    return (
      <div className='stat-list-item'>
        <div className='stat-name'>{ this.props.name }</div>
        <div onMouseOver={ this.showPopup.bind(this) }
            onMouseLeave={ this.hidePopup.bind(this) }
            className='stat-content'>
          <span className={ `delta ${this.deltaDirection}`}>
            <i className='fa fa-arrow-up'></i>
            <i className='fa fa-arrow-down'></i>
          </span>
          <span className='number'>{ number }</span>
          <div className={ popupClass }>
            { `${percentageText} from yesterday`}
          </div>
        </div>
      </div>
    )

  }
}
