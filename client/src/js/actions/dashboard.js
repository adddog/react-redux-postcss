import {
  DASHB_VIEWBOOK_SELECTED_INDEX,
  DASHB_VIEWBOOK_DRAG_SELECTED_INDEX,
  DASHB_VIEWBOOK_INDEX_GRABBED,
  DASHB_VIEWBOOK_INDEX_GRABBED_OVER,
  DASHB_VIEWBOOK_INDEX_CHANGED,
  DASHB_VIEWBOOK_MEDIA_DELETE,
  DASHB_VIEWBOOK_MEDIA_UPDATE,
  DASHB_VIEWBOOK_VIDEO_LINK,
  DASHB_VIEWBOOK_VIDEO_LINK_CONFIRMED,
  DASHB_VIEWBOOK_IMAGE_LINK,
  DASHB_VIEWBOOK_IMAGE_LINK_CONFIRMED,
  DASHB_VIEWBOOK_IMAGE_CHOSEN,
  DASHB_VIEWBOOK_IMAGE_UPLOAD,
  DASHB_VIEWBOOK_PUBLISH
} from 'actions/actionTypes';

/*
Images tiles
*/

export function viewbookSelectedMediaIndex(payload = {}) {
  return {
    type: DASHB_VIEWBOOK_SELECTED_INDEX,
    payload: payload
  };
}

export function viewbookDragSelectedMediaIndex(payload = {}) {
  return {
    type: DASHB_VIEWBOOK_DRAG_SELECTED_INDEX,
    payload: payload
  };
}

export function viewbookMediaIndexGrabbed(payload = {}) {
  return {
    type: DASHB_VIEWBOOK_INDEX_GRABBED,
    payload: payload
  };
}
export function viewbookMediaIndexGrabbedOver(payload = {}) {
  return {
    type: DASHB_VIEWBOOK_INDEX_GRABBED_OVER,
    payload: payload
  };
}

export function viewbookMediaIndexChanged(payload = {}) {
  return {
    type: DASHB_VIEWBOOK_INDEX_CHANGED,
    payload: payload
  };
}

export function viewbookMediaDelete(payload = {}) {
  return {
    type: DASHB_VIEWBOOK_MEDIA_DELETE,
    payload: payload
  };
}

export function viewbookMediaUpdate(payload = {}) {
  return {
    type: DASHB_VIEWBOOK_MEDIA_UPDATE,
    payload: payload
  };
}

/*
UPLOAD
*/

export function viewbookImageLink(payload = {}) {
  return {
    type: DASHB_VIEWBOOK_IMAGE_LINK,
    payload: payload
  };
}

export function viewbookImageLinkConfirm(payload = {}) {
  return {
    type: DASHB_VIEWBOOK_IMAGE_LINK_CONFIRMED,
    payload: payload
  };
}

export function viewbookVideoLink(payload = {}) {
  return {
    type: DASHB_VIEWBOOK_VIDEO_LINK,
    payload: payload
  };
}

export function viewbookVideoLinkConfirmed(payload = {}) {
  return {
    type: DASHB_VIEWBOOK_VIDEO_LINK_CONFIRMED,
    payload: payload
  };
}

export function viewbookImageChosen(payload = {}) {
  return {
    type: DASHB_VIEWBOOK_IMAGE_CHOSEN,
    payload: payload
  };
}

export function viewbookImageUpload(payload = {}) {
  return {
    type: DASHB_VIEWBOOK_IMAGE_UPLOAD,
    payload: payload
  };
}

export function viewbookPublish(payload = {}) {
  return {
    type: DASHB_VIEWBOOK_PUBLISH,
    payload: payload
  };
}
