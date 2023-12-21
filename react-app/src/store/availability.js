import { getTours } from "./tour";

// constants
// const LOAD_AVAILABILITIES = "language/LOAD_AVAILABILITIES";
// const POST_AVAILABILITIES = "langauge/POST_AVAILABILITIES"

export const getAvailabilities = () => async (dispatch) => {
    const response = await fetch(`/api/avail`);
    if (response.ok) {
        const data = await response.json();
        console.log(data)
    } else {
        return (await response.json());
    }
};


export const getOneTourAvail = (tour_id) => async (dispatch) => {
    const response = await fetch(`/api/avail/tour/${tour_id}`);
    if (response.ok) {
        const data = await response.json();
        return data
    } else {
        return (await response.json());
    }
};

export const getOneTourDateAvail = (tour_id, date_id) => async (dispatch) => {
    const response = await fetch(`/api/avail/tour/${tour_id}/${date_id}`);
    if (response.ok) {
        const data = await response.json();
        return data
    } else {
        return (await response.json());
    }
};

export const newAvailability = (tour_id, avail_data) => async (dispatch) => {
    const response = await fetch(`/api/avail/tour/${tour_id}/new`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(avail_data),
    });
    if (response.ok) {
        // const data = await response.json();
        console.log('successful posting new availability')
        dispatch(getTours());
    } else if (response.status < 500) {
        console.timeLog('errror posting new availability')
        const data = await response.json();
        console.log(data)
        if (data) {
            return data;
        }
    } else {
        return ["A new availability error occurred. Please try again."];
    }
};

export const deleteAvailabilities = (tour_id) => async (dispatch) => {
    const response = await fetch(`/api/avail/tour/${tour_id}/delete`, {
        method: 'DELETE',
    });
    if (response.ok) {
        dispatch(getTours())
    } else if (response.status < 500) {
        const data = await response.json();
        if (data.errors) {
            return data.errors;
        }
    } else {
        return ["An error occurred while deleting a tour. Please try again."];
    }
};

// const initialState = { availabilities: null };

// const availabilities = (state = initialState, action) => {
//     // const newState = { ...state }
//     switch (action.type) {
//         case LOAD_AVAILABILITIES:
//             return { ...action.payload }
//         case POST_AVAILABILITIES:
//             const data = action.payload
//             newState[data.id] = data
//             return newState
//         default:
//             return state;
//     }
// }


// export default availabilities;