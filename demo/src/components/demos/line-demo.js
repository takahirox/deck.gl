import React, {Component} from 'react';
import {readableInteger} from '../../utils/format-utils';
import {MAPBOX_STYLES} from '../../constants/defaults';
import LineOverlay from '../../../../examples/line/deckgl-overlay';

export default class LineDemo extends Component {

  static get data() {
    return [
      {
        url: 'data/flight-path-data.txt',
        worker: 'workers/flight-path-data-decoder.js'
      },
      {
        url: 'data/airports.json'
      }
    ];
  }

  static get parameters() {
    return {
      strokeWidth: {displayName: 'Stroke Width', type: 'number', value: 3, step: 1, min: 1}
    };
  }

  static get viewport() {
    return {
      ...LineOverlay.defaultViewport,
      mapStyle: MAPBOX_STYLES.DARK
    };
  }

  static renderInfo(meta) {
    return (
      <div>
        <h3>Flights In And Out Of Heathrow Airport</h3>
        <p>Flight paths from a 4 hour window on March 28th, 2017</p>
        <p>Flight tracking data source:
          <a href="https://opensky-network.org/"> The OpenSky Network</a><br />
          Airport data source:
          <a href="http://www.naturalearthdata.com/"> Natrual Earth</a>
        </p>
        <div className="stat">Segments<b>{ readableInteger(meta.count || 0) }</b></div>
      </div>
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      tooltipLine1: '',
      tooltipLine2: ''
    };
  }

  _onHover({x, y, object}) {
    let tooltipLine1 = '';
    let tooltipLine2 = '';
    if (object) {
      tooltipLine1 = object.name;
      tooltipLine2 = object.country || object.abbrev;
    }
    this.setState({x, y, tooltipLine1, tooltipLine2});
  }

  _renderTooltip() {
    const {x, y, tooltipLine1, tooltipLine2} = this.state;
    return tooltipLine1 && (
      <div className="tooltip" style={{left: x, top: y}}>
        <div>{ tooltipLine1 }</div>
        <div>{ tooltipLine2 }</div>
      </div>
    );
  }

  render() {
    const {viewport, params, data} = this.props;

    if (!data) {
      return null;
    }

    return (
      <div>
        <LineOverlay viewport={viewport}
          flightPaths={data[0]}
          airports={data[1]}
          onHover={this._onHover.bind(this)}
          strokeWidth={params.strokeWidth.value} />

        { this._renderTooltip() }

      </div>
    );
  }
}