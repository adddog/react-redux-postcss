import {
  COPY_SET,
  PREMIUM_PARTNER_ERROR,
  PREMIUM_PARTNER_SUCCESS,
  DASHB_VIEWBOOK_VIDEO_LINK,
  DASHB_VIEWBOOK_VIDEO_LINK_VALID,
  DASHB_VIEWBOOK_VIDEO_LINK_CONFIRMED,
  DASHB_VIEWBOOK_IMAGE_LINK,
  DASHB_VIEWBOOK_IMAGE_LINK_CONFIRMED,
  DASHB_VIEWBOOK_IMAGE_CHOSEN,
  DASHB_VIEWBOOK_IMAGE_UPLOAD,
  DASHB_VIEWBOOK_IMAGE_UPLOAD_SUCCESS,
  DASHB_VIEWBOOK_IMAGE_UPLOAD_ERROR,
  DASHB_VIEWBOOK_DRAG_SELECTED_INDEX,
  DASHB_VIEWBOOK_SELECTED_INDEX,
  DASHB_VIEWBOOK_INDEX_GRABBED,
  DASHB_VIEWBOOK_INDEX_GRABBED_OVER,
  DASHB_VIEWBOOK_INDEX_CHANGED,
  DASHB_VIEWBOOK_MEDIA_DELETE,
  DASHB_VIEWBOOK_MEDIA_UPDATE,
  INSTRUCTION_CLICKED,
} from "actions/actionTypes"
import Auth from "modules/Auth"
import { Map } from "immutable"
import {
  assign,
  compact,
  merge,
  indexOf,
  find,
  isNil,
  isArray,
} from "lodash"
import { getIndexRequiringMedia } from "selectors/dashboard/getSelectors"
import { getSelectedTile } from "selectors/dashboard/makeGetSelectedTile"
import { getSortedDragSelectedIndexs } from "selectors/dashboard/makeGetDragSelectedTiles"
import {
  getYoutubeLinkValidation,
  YouTubeGetID,
} from "selectors/componentUI/makeGetModalConfirmation"

const MAX_VIEWBOOK_MEDIA = 24
/*
    id: "one",
      url: "images/one.jpg",
      caption: "Some captio"
*/
const initialState = new Map()
  .set("map", undefined)
  .set("schools", undefined)
  //TODO
  .set("instructions", [])
  /*MEDIA*/
  .set("hasViewbookVideoError", false)
  .set("viewbookVideoLink", null)
  .set("viewbookImageLink", null)
  .set("viewbookImageChosen", null) // from local file select
  .set("viewbookImageUploading", false)
  .set("viewbookMediaMax", MAX_VIEWBOOK_MEDIA)
  .set("viewbookSelectedMediaIndex", 0)
  .set("viewbookDragSelectedMediaIndexs", [])
  .set("viewbook", new Array(MAX_VIEWBOOK_MEDIA).fill(null))
  .set("viewbookRequiresPublishing", null)
  .set("grabbedMediaTileIndex", undefined)
  .set("grabbedMediaTile", undefined)
  //when grabbing, where we are hovering
  .set("grabbedMediaTargetTileIndex", undefined)

const updateViewbookTile = (state, payload) => {
  let newArray = state.get("viewbook")
  const viewbookSelectedMediaIndex = state.get(
    "viewbookSelectedMediaIndex"
  )

  newArray[viewbookSelectedMediaIndex] = merge(
    getSelectedTile(state),
    payload
  )
  return newArray
}

const VIEWBOOK_MODEL = {
  isVideo: false,
  thumbURL: null,
  url: null,
}

const createViewbookTileVO = (state, data) => {
  const ytId = YouTubeGetID(
    state.get("viewbookVideoLink") || data.url
  )
  const thumbURL = ytId
    ? `http://img.youtube.com/vi/${ytId}/1.jpg`
    : data.url
  return Object.assign({}, VIEWBOOK_MODEL, data, {
    hasMedia: !!data.url,
    thumbURL,
  })
}

export default function dashboard(state = initialState, action) {
  switch (action.type) {
    case COPY_SET: {
      const { response } = action
      const { DashboardMediaComponent } = response
      return state.set("instructions", [
        {
          component: "DashboardMediaComponent",
          closed: false,
          label: DashboardMediaComponent["mediaDrag"],
        },
        {
          component: "DashboardMediaComponent",
          closed: false,
          delay:4000,
          classes: ["root--pos-right"],
          label: DashboardMediaComponent["selectDrag"],
        },
      ])
    }
    case PREMIUM_PARTNER_ERROR: {
      const { response } = action
      if (process.env.DEV) {
        return state.set("viewbook", [
          createViewbookTileVO(state, {
            id: "one",
            url: "images/one.jpg",
            caption: "Some caption",
          }),
          createViewbookTileVO(state, {
            id: "two",
            url: "images/two.jpg",
            caption: "Some caption",
          }),
        ])
      }
    }
    case PREMIUM_PARTNER_SUCCESS: {
      const { response } = action
      console.log("PREMIUM_PARTNER_SUCCESS::response", response)
      if (!response.gallery_data) return state
      const galleryData = response.gallery_data
      const parsedGalleryData = galleryData.map(tile =>
        createViewbookTileVO(state, tile)
      )

      return state
        .set("viewbook", parsedGalleryData)
        .set(
          "viewbookSelectedMediaIndex",
          getIndexRequiringMedia(parsedGalleryData)
        )
    }
    case DASHB_VIEWBOOK_IMAGE_CHOSEN: {
      const { payload } = action
      return state.set("viewbookImageChosen", payload)
    }
    case DASHB_VIEWBOOK_IMAGE_LINK: {
      const { payload } = action
      return state.set("viewbookImageLink", payload)
    }
    case DASHB_VIEWBOOK_IMAGE_LINK_CONFIRMED: {
      const { payload } = action
      return state
        .set("viewbook", [
          ...updateViewbookTile(
            state,
            createViewbookTileVO(state, {
              url: state.get("viewbookImageLink"),
            })
          ),
        ])
        .set("viewbookRequiresPublishing", true)
    }
    case DASHB_VIEWBOOK_VIDEO_LINK: {
      const { payload } = action
      return state.set("viewbookVideoLink", payload)
    }
    case DASHB_VIEWBOOK_VIDEO_LINK_CONFIRMED: {
      if (state.get("hasViewbookVideoError")) return state
      const viewbook = [
        ...updateViewbookTile(
          state,
          createViewbookTileVO(state, {
            isVideo: true,
            url: state.get("viewbookVideoLink"),
          })
        ),
      ]
      return state
        .set("viewbook", viewbook)
        .set("hasViewbookVideoError", false)
        .set("viewbookRequiresPublishing", true)
        .set(
          "viewbookSelectedMediaIndex",
          getIndexRequiringMedia(viewbook)
        )
    }
    case DASHB_VIEWBOOK_VIDEO_LINK_VALID: {
      const { payload } = action
      return state.set("hasViewbookVideoError", !payload)
    }
    case DASHB_VIEWBOOK_IMAGE_UPLOAD: {
      return state.set("viewbookImageUploading", true)
    }
    case DASHB_VIEWBOOK_IMAGE_UPLOAD_SUCCESS: {
      const { response } = action
      const viewbook = [
        ...updateViewbookTile(
          state,
          createViewbookTileVO(state, response)
        ),
      ]
      return state
        .set("viewbook", viewbook)
        .set("viewbookImageUploading", false)
        .set("viewbookRequiresPublishing", true)
        .set(
          "viewbookSelectedMediaIndex",
          getIndexRequiringMedia(viewbook)
        )
    }
    case DASHB_VIEWBOOK_IMAGE_UPLOAD_ERROR: {
    }
    case DASHB_VIEWBOOK_SELECTED_INDEX: {
      const { payload } = action
      return state
        .set("viewbookSelectedMediaIndex", payload)
        .set("viewbookDragSelectedMediaIndexs", [])
    }
    case DASHB_VIEWBOOK_DRAG_SELECTED_INDEX: {
      const { payload } = action
      return state
        .set("viewbookDragSelectedMediaIndexs", payload)
        .set("viewbookSelectedMediaIndex", null)
    }
    case DASHB_VIEWBOOK_INDEX_GRABBED: {
      const { payload } = action
      let newArray = state.get("viewbook")
      //remove
      newArray.splice(payload.index, 1)
      return state
        .set("grabbedMediaTileIndex", payload.index)
        .set("grabbedMediaTile", payload.tile)
        .set("viewbook", newArray)
    }
    case DASHB_VIEWBOOK_INDEX_GRABBED_OVER: {
      const { payload } = action
      return state.set("grabbedMediaTargetTileIndex", payload)
    }
    case DASHB_VIEWBOOK_INDEX_CHANGED: {
      const { payload } = action
      const { index } = payload

      let newArray = state.get("viewbook")
      //add
      const grabbedMediaTargetTileIndex = isNil(
        state.get("grabbedMediaTargetTileIndex")
      )
        ? state.get("viewbookSelectedMediaIndex")
        : state.get("grabbedMediaTargetTileIndex")
      newArray.splice(
        grabbedMediaTargetTileIndex,
        0,
        state.get("grabbedMediaTile")
      )
      return state
        .set("viewbook", compact(newArray))
        .set("grabbedMediaTargetTileIndex", undefined)
        .set("grabbedMediaTileIndex", undefined)
        .set("grabbedMediaTile", undefined)
        .set("viewbookRequiresPublishing", true)
    }
    case DASHB_VIEWBOOK_MEDIA_DELETE: {
      let newArray = state.get("viewbook")

      const newState = state
        .set(
          "viewbookSelectedMediaIndex",
          state.get("viewbook").length - 1
        )
        .set("grabbedMediaTargetTileIndex", undefined)
        .set("grabbedMediaTileIndex", undefined)
        .set("grabbedMediaTile", undefined)
        .set("viewbookRequiresPublishing", true)

      if (state.get("grabbedMediaTile")) {
        return newState
      }

      const sortedDragSelectedIndex = getSortedDragSelectedIndexs(
        state
      )
      if (sortedDragSelectedIndex.length) {
        sortedDragSelectedIndex.forEach(i => (newArray[i] = null))
        return newState
          .set("viewbook", newArray)
          .set("viewbookDragSelectedMediaIndexs", [])
          .set(
            "viewbookSelectedMediaIndex",
            getIndexRequiringMedia(newArray)
          )
      }

      if (isNil(state.get("viewbookSelectedMediaIndex"))) return state

      newArray[state.get("viewbookSelectedMediaIndex")] = null

      return newState.set("viewbook", newArray)
    }
    case DASHB_VIEWBOOK_MEDIA_UPDATE: {
      const { payload } = action
      return state
        .set("viewbook", [...updateViewbookTile(state, payload)])
        .set("viewbookRequiresPublishing", true)
    }
    case INSTRUCTION_CLICKED: {
      const { payload } = action
      const instructions = [...state.get("instructions")]
      const i = indexOf(instructions, payload)
      if (!instructions[i]) return state
      instructions[i].closed = true
      return state.set("instructions", instructions)
    }
    default: {
      return state
    }
  }
}
