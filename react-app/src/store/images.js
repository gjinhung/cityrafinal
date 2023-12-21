
const GET_IMAGES = "images/GET_IMAGES";
const NEW_IMAGE = 'images/NEW_IMAGE'
const REMOVE_IMAGE = "images/REMOVE_IMAGE";

const getImage = (images) => ({
    type: GET_IMAGES,
    images
});

const addImage = ({ data }) => {
    return {
        type: NEW_IMAGE,
        data
    }
}

const removeImage = (img_id) => ({
    type: REMOVE_IMAGE,
    img_id
});


export const images = (tour_id) => async (dispatch) => {
    const response = await fetch(`/api/tours/${tour_id}/images`)
    if (response.ok) {
        const data = await response.json()

        dispatch(getImage(data))
        return data.images
    }
    else {
        const data = await response.json()
        return (data.error)
    }
}

export const getImageData = (tourId) => async (dispatch) => {
    const response = await fetch(`/api/tour/${tourId}/images`)
    if (response.ok) {
        const data = await response.json()
        return data.images
    }
    else {
        const data = await response.json()
        return (data.error)
    }
}

export const createImage = (tour_id, imageData) => async (dispatch) => {

    const response = await fetch(`/api/tour/${tour_id}/images/new`, {
        method: "POST",
        // headers: {
        //     "Content-Type": "application/json"
        // },
        body: imageData,
    })
    console.log(" THIS IS IMAGE DATA", imageData.url)

    if (response.ok) {
        const data = await response.json()
        dispatch(addImage({ data }))
        return null
    } else if (response.status < 500) {
        const data = await response.json();
        if (data.errors) {
            return data.errors;
        }
    } else {
        return ["An error occurred. Please try again."];
    }
}

export const deleteImage = (img_id) => async (dispatch) => {
    const response = await fetch(`/api/tour/images/${img_id}`, {
        method: "DELETE"
    })
    if (response.ok) {
        dispatch(removeImage(img_id))
        return null
    }
    else {
        const data = await response.json();
        if (data) {
            return data;
        }
    }
}

const initialState = { images: null };

const tour_images = (state = initialState, action) => {
    let newState = {};
    switch (action.type) {
        case GET_IMAGES:
            newState = action.images
            return newState;
        case NEW_IMAGE:
            newState = {
                ...state,
                [action.data.id]: action.data
            }
            return newState;
        case REMOVE_IMAGE:
            newState = { ...state }
            delete newState[action.img_id]
            return newState
        default:
            return state
    }
}

export default tour_images;
