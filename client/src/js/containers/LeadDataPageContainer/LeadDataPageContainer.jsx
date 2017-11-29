import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import { LEAD_DATA_PAGE_CONTAINER, NAVIGATION_HEIGHT } from 'utils/styling';

import CalendarComponent from 'components/CalendarComponent/CalendarComponent';
import LeadTableComponent from 'components/LeadTableComponent/LeadTableComponent';
import LeadTableFilterHeadersComponent from 'components/LeadTableComponent/LeadTableFilterHeadersComponent';
import LeadTableFilterComponent from 'components/LeadTableComponent/LeadTableFilterComponent';

import { isNil, isEmpty } from 'lodash';

import styles from './LeadDataPageContainer.css';

export default class LeadDataPageContainer extends Component {
  static propTypes = {
    leadData: PropTypes.object.isRequired,
    browser: PropTypes.object.isRequired
  };

  componentDidMount() {
    const { auth, browser, leadData } = this.props;
    this.props.resize();
    if (isNil(leadData.get('leadDataValues')) || isEmpty(leadData.get('leadDataValues'))) {
      this.props.leadDataRequest();
    }
    this._calcDimensions();
  }

  componentWillReceiveProps() {
    this._calcDimensions();
  }

  _calcDimensions() {
    const { browser } = this.props;
    const style = this.refs.contentEl.currentStyle || window.getComputedStyle(this.refs.contentEl);
    const width =
      Math.min(this.refs.contentEl.offsetWidth, browser.width) -
      parseFloat(style.paddingLeft) -
      parseFloat(style.paddingRight);

    const height =
      Math.min(this.refs.contentEl.offsetHeight, browser.height - NAVIGATION_HEIGHT) -
      parseFloat(style.paddingTop) -
      parseFloat(style.paddingBottom);

    this.props.setComponentDimensions({
      name: LEAD_DATA_PAGE_CONTAINER,
      dimensions: {
        width,
        height
      }
    });
  }

  @autobind
  onCalendarSelect(e) {
    this.props.dateSelect({
      start: e.start,
      end: e.end
    });
  }

  render() {
    const { leadData } = this.props;
    return (
      <section ref="rootEl" style={{}} className={classnames([styles.root, 'u-container full'])}>
        <div ref="contentEl" className={classnames([styles.uCardContent])}>
          <LeadTableFilterComponent />
          <CalendarComponent onSelect={this.onCalendarSelect} showInputs={true} />
          <LeadTableFilterHeadersComponent />
          <LeadTableComponent />
        </div>
      </section>
    );
  }
}
