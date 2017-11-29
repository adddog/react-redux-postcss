import { createSelector } from 'reselect';
import path from 'path-parse';
import validator from 'validator';
import { ROUTES } from 'routes/configureRoutes';
import { forIn, isEmpty, map, has } from 'lodash';

import { getDragSelectedTiles } from 'selectors/dashboard/makeGetDragSelectedTiles';
import { getSelectedTile } from 'selectors/dashboard/makeGetSelectedTile';
import { getChosenMedia } from 'selectors/componentUI/getChosenMedia';

import { MODAL_TYPES } from 'components/ModalComponent/ModalComponent';

const getHTMLMediaMessage = name =>
  `<div><p>You will overwrite the selected media with <i>${name}</i></p></br><div>Are you sure?</div></div>`;
const getHTMLPublishMessage = name => `<p>Publish content?</p>`;
const getHTMLDragSelect = number => `<p>Delete ${number} items?</p>`;

export const YouTubeGetID = url => {
  if (!url) return null;
  let ID = '';
  url = url
    .replace(/(>|<)/gi, '')
    .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if (url[2] !== undefined) {
    ID = url[2].split(/[^0-9a-z_\-]/i);
    ID = ID[0];
  } else {
    ID = null;
  }
  return ID;
};

export const youtubeRegex = (str = '') =>
  str.match(
    /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})?$/
  );

export const getYoutubeLinkValidation = (state, action = {}) => {
  const { dashboard = state } = state;
  const viewbookVideoLink = dashboard.get('viewbookVideoLink');
  const payload = isEmpty(action.payload) ? viewbookVideoLink : action.payload;

  if (!payload) return null;
  return youtubeRegex(payload);
};

export const getModalConfirmation = state => {
  const selectedTile = getSelectedTile(state);
  const file = getChosenMedia(state);
  const url = state.dashboard.get('viewbookImageLink');

  switch (state.components.get('modalType')) {
    case MODAL_TYPES.IMAGE_CONFIRM_UPLOAD: {
      if (isEmpty(selectedTile)) return null;
      if (has(selectedTile, 'url') && !!file) {
        return {
          html: getHTMLMediaMessage(file[0].name)
        };
      }
      return null;
    }
    case MODAL_TYPES.IMAGE_CONFIRM_LINK: {
      if (isEmpty(selectedTile)) return null;
      if (has(selectedTile, 'url') && !!url) {
        return {
          html: getHTMLMediaMessage(path(url).base),
          valid: validator.isURL(url)
        };
      }
      return null;
    }
    case MODAL_TYPES.VIDEO: {
      if (isEmpty(selectedTile)) return null;
      if (has(selectedTile, 'url') && getYoutubeLinkValidation(state)) {
        return {
          html: getHTMLMediaMessage(state.dashboard.get('viewbookVideoLink'))
        };
      }
      return null;
    }
    case MODAL_TYPES.CONFIRM_PUBLISH: {
      return {
        html: getHTMLPublishMessage()
      };
    }
    case MODAL_TYPES.CONFIRM_SELECT_DELETE: {
      const length = getDragSelectedTiles(state).length;
      return {
        html: getHTMLDragSelect(length)
      };
    }

    default: {
      return null;
    }
  }
};

export const makeGetModalConfirmation = () =>
  createSelector(
    [state => getModalConfirmation(state)],
    errorMessages => errorMessages
  );

export default makeGetModalConfirmation;
