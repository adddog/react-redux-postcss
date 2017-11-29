import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { debounce, throttle } from 'lodash-decorators';
import { autobind } from 'core-decorators';
const shallowEqualObjects = require('shallow-equal/objects');

import { uniqBy, isEmpty, isNil, compact, map, omit, pickBy, identity } from 'lodash';

import { DASHBOARD_PAGE_DASHBOARD_MEDIA_COMPONENT } from 'utils/styling';

import { getInstructions } from 'selectors/componentUI/getInstructions';
import makeGetMediaTiles from 'selectors/dashboard/makeGetMediaTiles';
import makeGetDashboardMediaThumbDimensions from 'selectors/componentUI/makeGetDashboardMediaThumbDimensions';
import {
  getDragSelectedTiles,
  getSortedDragSelectedIndexs
} from 'selectors/dashboard/makeGetDragSelectedTiles';

import styles from './DashboardMediaComponent.css';

import {
  viewbookMediaDelete,
  viewbookSelectedMediaIndex,
  viewbookDragSelectedMediaIndex,
  viewbookMediaIndexChanged,
  viewbookMediaIndexGrabbed,
  viewbookMediaIndexGrabbedOver
} from 'actions/dashboard';

import { MODAL_TYPES } from 'components/ModalComponent/ModalComponent';

import { instructionClicked } from 'actions/common';
import { openModal } from 'actions/componentUI';

import BasicIconComponent from 'components/UI/BasicIconComponent';
import InstructionTooltipComponent from 'components/UI/InstructionTooltipComponent';
import InfoTooltipComponent from 'components/UI/InfoTooltipComponent';
import DashboardMediaDragComponent from './DashboardMediaDragComponent';
import DashboardMediaTileComponent from './DashboardMediaTileComponent';

class DashboardMediaComponent extends Component {
  static displayName = 'DashboardMediaComponent';

  constructor(props) {
    super(props);
    this.state = {
      startDragPosition: {},
      dragPosition: {},
      isDragging: false,
      isGrabbing: false,
      grabbedTileIndex: undefined,
      confirmingDelete: false,
      showTrashPopup: false,
      isOverTrash: false,
      tileWidth: 49
    };
    this._mousePosition = {};
    this._overTileIndex = NaN;
  }

  componentDidMount() {
    const { dashboard } = this.props;
    window.addEventListener('mousedown', this._onMouseWindowDown, false);
    window.addEventListener('mousemove', this._onMouseMove, false);
    window.addEventListener('mouseup', this._onMouseUp, false);
    window.addEventListener('mouseleave', this._onMouseUp, false);
    this._computeAreaDimensions();
    this._calculateTileDimensions();
    this._showTo = setTimeout(this._showAnimation, 400);
    this._dragSelectTiles = [];
  }

  @autobind
  _showAnimation() {
    this.refs.contentEl.classList.add(styles['row--show']);
  }

  _computeAreaDimensions() {
    const style = this.refs.rootEl.currentStyle || window.getComputedStyle(this.refs.rootEl);

    this._dimensions = {
      width:
        this.refs.rootEl.offsetWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight),
      height:
        this.refs.rootEl.offsetHeight -
        parseFloat(style.paddingTop) -
        parseFloat(style.paddingBottom)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.browser.width !== this.props.browser.width) {
      this._computeAreaDimensions();
      this._calculateTileDimensions();
    }
  }

  /* shouldComponentUpdate(nextProps, nextState) {
    let update =
      nextProps.dashboard.get("viewbookDragSelectedMediaIndexs")
        .length !==
        this.props.dashboard.get("viewbookDragSelectedMediaIndexs")
          .length || !shallowEqualObjects(this.state, nextState)
    return update
  }
*/
  componentDidUpdate(prevProps, prevState) {
    if (prevState.isGrabbing && !this.state.isGrabbing) {
      this._resetGrabbedTile();
    }
    this._moveTile();
  }

  componentWillUnmount() {
    clearTimeout(this._showTo);
    window.removeEventListener('mousedown', this._onMouseWindowDown);
    window.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('mouseup', this._onMouseUp);
    window.removeEventListener('mouseleave', this._onMouseUp);
  }

  _isGrabbing(tile) {
    const { dashboard } = this.props;
    this.setState({
      isGrabbing: true,
      grabbedTileIndex: tile
    });
    this.props.viewbookMediaIndexGrabbed({
      index: tile,
      tile: dashboard.get('viewbook')[tile]
    });
    this._moveTile();
  }

  _moveTile() {
    if (this.refs.grabbed) {
      this.refs.grabbed.style.top = `${this._mousePosition.y}px`;
      this.refs.grabbed.style.left = `${this._mousePosition.x}px`;
    }
  }

  @autobind
  _onMouseMove(e) {
    this._mousePosition.x = e.clientX;
    this._mousePosition.y = e.clientY;
    if (this.state.isGrabbing) {
      this._moveTile();
    } else if (this.state.isDragging) {
      this._mouseDragDebounce(e);
    }
  }

  @debounce(10)
  _mouseDragDebounce(e) {
    this.setState({
      dragPosition: {
        x: e.pageX,
        y: e.pageY
      }
    });
  }

  @autobind
  _onMouseOver(tile) {
    this._overTileIndex = tile;
    if (this.state.isGrabbing && !this.state.isOverTrash) {
      this.props.viewbookMediaIndexGrabbedOver(this._overTileIndex);
    }
  }

  @autobind
  _onMouseOut(tile) {
    this._overTileIndex = NaN;
  }

  @autobind
  _onMouseWindowDrag(e) {
    this._dragSelectTiles = [];
    this.setState({
      isDragging: true,
      startDragPosition: { x: e.pageX, y: e.pageY }
    });
  }

  @autobind
  _onMouseWindowDown(e) {
    const targetClasslist = e.target.classList;
    if (!targetClasslist[0]) return;
    if (targetClasslist[0].indexOf('DashboardMedia') < 0) return;
    clearTimeout(this._timerWindowTo);
    this._timerWindowTo = setTimeout(this._onMouseWindowDrag, 75, e);
  }

  @autobind
  _onMouseDown(tile) {
    const { dashboard, viewbook } = this.props;
    if (isEmpty(dashboard.get('viewbook')[tile])) return;
    clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      this._isGrabbing(tile);
    }, 300);
  }

  _calculateTileDimensions() {
    const { dashboard } = this.props;
    const totalTiles = dashboard.get('viewbookMediaMax') + 1;
    const { width, height } = this._dimensions;
    const BASE_W = 45 + 8;
    const BASE_H = BASE_W * 0.75 + 4;

    let _found = false;
    let _newWidth, _newHeight, _newTotalHeight;
    let _i = 0;
    while (!_found) {
      _newWidth = BASE_W + _i;
      _newHeight = _newWidth * 0.75;
      const computedRow = Math.floor(width / _newWidth);
      const numRows = Math.floor(totalTiles / computedRow);
      const remainder = totalTiles - computedRow * numRows;
      const totalRows = numRows + (remainder > 0 ? 1 : 0);
      _newTotalHeight = totalRows * _newHeight;
      if (_newTotalHeight >= height - _newHeight * 2 || _newWidth * numRows >= width) {
        _found = true;
        break;
      }
      _i++;
    }
    if (_newTotalHeight > height) {
      this.refs.rootEl.classList.add(styles['root--scroll']);
    } else {
      this.refs.rootEl.classList.remove(styles['root--scroll']);
    }

    this.setState({
      tileWidth: _newWidth - 2
    });
  }

  _resetGrabbedTile() {
    if (this.refs.grabbed) {
      this.refs.grabbed.style.top = `auto`;
      this.refs.grabbed.style.left = `auto`;
    }
    this.props.viewbookMediaIndexChanged({
      index: this.state.grabbedTileIndex
    });
    this.props.viewbookSelectedMediaIndex(this._overTileIndex);
  }

  @autobind
  _onMouseUp(tile = null, state = {}) {
    clearTimeout(this._timerWindowTo);
    clearTimeout(this._timer);
    if (this.state.isGrabbing && !this.state.isOverTrash && this.refs.grabbed) {
      this._resetGrabbedTile();
    }
    this.setState({
      ...state,
      startDragPosition: null,
      dragPosition: null,
      isDragging: false,
      isGrabbing: false,
      grabbedTileIndex: undefined
    });
  }

  @autobind
  _onClicked(index) {
    clearTimeout(this._timer);
    this.props.viewbookSelectedMediaIndex(index);
  }

  @autobind
  _tileSelectDragDispatch() {
    this.props.viewbookDragSelectedMediaIndex(this._dragSelectTiles);
  }

  @autobind
  _tileSelectDragChange(obj) {
    clearTimeout(this._dragSelectTo);
    this._dragSelectTiles.unshift(obj);
    this._dragSelectTiles = uniqBy(this._dragSelectTiles, 'index');
    if (this._dragSelectTiles.length > this.props.dashboard.get('viewbookMediaMax')) {
      this._dragSelectTiles.shift();
    }
    this._dragSelectTo = setTimeout(this._tileSelectDragDispatch, 200);
  }

  _renderTile(props) {
    return (
      <div
        className={classnames([
          styles.tileWrapper,
          props.isGrabbed ? styles['tileWrapper--grabbed'] : null
        ])}
        key={props.tileIndex}
        ref={props.isGrabbed ? 'grabbed' : `tile_${props.tileIndex}`}
      >
        <DashboardMediaTileComponent
          {...omit(this.props, ['browser', 'viewbook', 'dashboard', 'sortedDragSelectedIndexs'])}
          //remove falsy
          {...pickBy(
            {
              tileMinWidth: this.state.tileWidth,
              startDragPosition: !props.isTrash ? this.state.startDragPosition : null,
              dragPosition: !props.isTrash ? this.state.dragPosition : null,
              isDragging: !props.isTrash ? this.state.isDragging : null,
              tileSelectDragChange: !props.isTrash ? this._tileSelectDragChange : null
            },
            identity
          )}
          {...omit(props, 'children')}
        >
          {props.children}
          {props.popup}
        </DashboardMediaTileComponent>
      </div>
    );
  }

  _renderTrashTile() {
    const { dashboard } = this.props;
    const grabbedMediaTile = dashboard.get('grabbedMediaTile');
    return this._renderTile({
      isTrash: true,
      classes: ['root__trash'],
      tileIndex: dashboard.get('viewbookMediaMax'),
      isGrabbed: false,
      onClick: () =>
        this.setState({
          confirmingDelete: !this.state.confirmingDelete
        }),
      onMouseOver: () => {
        if (grabbedMediaTile) {
          this.setState({
            showTrashPopup: true,
            isOverTrash: true
          });
        }
      },
      onMouseOut: () =>
        this.setState({
          showTrashPopup: false,
          isOverTrash: false
        }),
      onMouseLeave: () =>
        this.setState({
          showTrashPopup: false,
          isOverTrash: false
        }),
      onMouseDown: () => {},
      onMouseUp: () => {
        if (this.state.isGrabbing) {
          this.setState({
            showTrashPopup: false,
            isOverTrash: false,
            isGrabbing: false,
            grabbedTileIndex: undefined
          });
          this.props.viewbookMediaDelete();
        }
      },
      popup: this.state.showTrashPopup ? (
        <InfoTooltipComponent
          data={{ label: 'Release to delete' }}
          noIcon={true}
          timeout={3000}
          onClick={() =>
            this.setState({
              showTrashPopup: false
            })}
          classes={['root--nowrap', 'root--noInteract', 'tooltip--left']}
          tooltipClasses={['tooltip--left']}
        />
      ) : null,
      children: (
        <BasicIconComponent
          icon="trash"
          classes={['root--abs--center']}
          confirmation={{
            onYes: () => {
              /*
              Only delete if there is media in selected tiles
              */
              if (getDragSelectedTiles(this.props, this.props.viewbook).length) {
                this.props.openModal(MODAL_TYPES.CONFIRM_SELECT_DELETE);
              } else {
                this.props.viewbookMediaDelete();
              }
            },
            onNo: () =>
              this.setState({
                confirmingDelete: false
              })
          }}
          showConfirmation={this.state.confirmingDelete}
        />
      )
    });
  }

  _renderViewbookTile(tileData, tileIndex = NaN, isGrabbed = false) {
    if (!tileData) return null;
    const { dashboard } = this.props;

    const viewbookSelectedMediaIndex = dashboard.get('viewbookSelectedMediaIndex');

    const length = dashboard.get('viewbook').filter(o => !isEmpty(o)).length;

    return this._renderTile({
      onClick: this._onClicked,
      onMouseOver: this._onMouseOver,
      onMouseOut: this._onMouseOut,
      onMouseLeave: this._onMouseOut,
      onMouseDown: this._onMouseDown,
      onMouseUp: this._onMouseUp,
      tileData,
      tileIndex,
      isGrabbed,
      isDragSelected: this.props.sortedDragSelectedIndexs.indexOf(tileIndex) > -1,
      isSelected: viewbookSelectedMediaIndex === tileIndex,
      isDisabled: isEmpty(tileData) && tileIndex > length
    });
  }

  _renderInstruction() {
    const { viewbook, dashboard } = this.props;
    if (compact(viewbook).length < 2 || !this.props.instructions.length) return null;
    return (
      <InstructionTooltipComponent
        data={this.props.instructions}
        timeout={6000}
        onClick={this.props.instructionClicked}
      />
    );
  }

  render() {
    const { dashboard, browser } = this.props;
    const viewbookSelectedMediaIndex = dashboard.get('viewbookSelectedMediaIndex');
    const grabbedMediaTile = dashboard.get('grabbedMediaTile');
    return (
      <div
        ref="rootEl"
        className={classnames([
          styles.root,
          styles.uCardNoAnim,
          styles['uCard--light'],
          styles['uCard--padding--sm'],
          styles.uCardSeperated
        ])}
      >
        {this._renderInstruction()}
        <div ref="contentEl" className={classnames([styles.row])}>
          {new Array(dashboard.get('viewbookMediaMax'))
            .fill(1)
            .map((v, i) => i)
            .map(v => this.props.viewbook[v] || {})
            .map((data, i) => {
              return this._renderViewbookTile(data, i);
            })
            .concat([this._renderTrashTile()])}

          {this._renderViewbookTile(grabbedMediaTile, NaN, true)}
        </div>
        <DashboardMediaDragComponent
          size={{ width: browser.width, height: browser.height }}
          startDragPosition={this.state.startDragPosition}
          dragPosition={this.state.dragPosition}
          isDragging={this.state.isDragging}
        />
      </div>
    );
  }
}

const mapStateToProps = () => {
  return (state, ownProps) => {
    const getMediaTiles = makeGetMediaTiles();
    return {
      browser: state.browser,
      viewbook: getMediaTiles(state),
      instructions: getInstructions(state.dashboard, DASHBOARD_PAGE_DASHBOARD_MEDIA_COMPONENT),
      sortedDragSelectedIndexs: getSortedDragSelectedIndexs(state),
      dashboard: state.dashboard,
      ...ownProps
    };
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  openModal: componentName => dispatch(openModal(componentName)),
  viewbookSelectedMediaIndex: index => dispatch(viewbookSelectedMediaIndex(index)),
  viewbookDragSelectedMediaIndex: index => dispatch(viewbookDragSelectedMediaIndex(index)),
  viewbookMediaIndexChanged: index => dispatch(viewbookMediaIndexChanged(index)),
  viewbookMediaIndexGrabbed: data => dispatch(viewbookMediaIndexGrabbed(data)),
  viewbookMediaIndexGrabbedOver: index => dispatch(viewbookMediaIndexGrabbedOver(index)),
  instructionClicked: instruction => dispatch(instructionClicked(instruction)),
  viewbookMediaDelete: () => dispatch(viewbookMediaDelete())
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardMediaComponent);
