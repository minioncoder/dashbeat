import React from 'react';

import StatListItem from './components/statListItem';

import { QUICKSTATS, TOTALSTORIES, TOTALMINUTES, PEAKCONCURRENT, TOPSTORIES,
  TOPAUTHORS } from '../store/dashboardStore';

export default class Host extends React.Component {
  constructor(args) {
    super(args);

    this.state = {
      notesOpen: false
    }
  }

  componentDidMount() {
    if (this.props.activeOption === QUICKSTATS) this.drawPieChart();
  }

  componentDidUpdate() {
    if (this.props.activeOption === QUICKSTATS) this.drawPieChart();
  }

  noteViewToggle() {
    let notesOpen = !this.state.notesOpen;
    this.setState({ notesOpen });
  }

  drawPieChart() {
    //TODO
  }

  getPieChartId() {
    return `${this.props.host}-pie-chart`
  }

  /**
   * Render the quick stats for each host
   */
  renderQuickStats() {
    let overview = this.props.data.overview;

    return (
      <div className='host-data quick-stats'>
        <div className='stat-list'>
          <StatListItem name='Total Engaged Time' data={ overview.data.total_engaged_time }/>
          <StatListItem name='Published Articles' data={ overview.data.num_articles }/>
          <StatListItem name='Maximum Concurrent Readers' data={ overview.data.max_concurrents }/>
        </div>
        <div id={ this.getPieChartId() } className='pie-chart'>
        </div>
      </div>
    )
  }

  /**
   * Render the top stories for each host
   */
  renderTopStories() {
    let topStories = this.props.data.toppages;
  }

  /**
   * Every section has notes (or madlibs) that are sentance-based blurbs about
   * the day
   */
  renderNotes() {
    let groupedNotes = {};
    let defaultType = 'summary';

    let data;
    switch(this.props.activeOption) {
      case QUICKSTATS:
        data = this.props.data.overview;
        break;
      default: // TODO
        return null;
    }

    let notes = data.notes;
    for (var i = 0; i < notes.length; i++) {
      let type = i < data.madlibs.length ? data.madlibs[i].type : defaultType;
      let note = (<li className='note'>{ notes[i] }</li>)

      if (type in groupedNotes) groupedNotes[type].push(note);
      else groupedNotes[type] = [note];
    }

    notes = [];
    for (var type in groupedNotes) {
      let n = groupedNotes[type];
      notes.push(
        <ul className='note-group'>
          <div className='note-type'>{{ type }}</div>
          { n.map((note) => { return note; }) }
        </ul>
      )
    }

    return (
      <div className={ `notes stat-list-item ${ this.state.notesOpen ? 'show' : ''}` }>
        <div onClick={ this.noteViewToggle.bind(this) }
           className='stat-name'>
          Notes <i className='fa fa-caret-down'></i>
         </div>
        <div className='notes-container'>
          { notes.map((note) => { return note })}
        </div>
      </div>
    )

  }

  /**
   * Render the data based on the active option.
   */
  renderData() {
    switch(this.props.activeOption) {
      case QUICKSTATS:
        return this.renderQuickStats();
        break;
      case TOPSTORIES:
        return this.renderTopStories();
        break;
    }
  }

  render() {
    return (
      <div className='host-container'>
        <div className={ `host ${this.props.host}` }>
          <div className='host-title'>{ this.props.name }</div>
          <div className={ `host-data-container ${this.props.activeOption}` }>
            { this.renderNotes() }
            { this.renderData() }
          </div>
        </div>
      </div>
    )
  }
}

