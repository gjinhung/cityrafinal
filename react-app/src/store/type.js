// constants
const LOAD_TYPES = "specialty/LOAD_TYPES";

const loadTypes = (data) => ({
    type: LOAD_TYPES,
    payload: data,
});

export const getTypes = () => async (dispatch) => {
    const response = await fetch(`/api/type`);
    if (response.ok) {
        const data = await response.json();
        dispatch(loadTypes(data));
    } else {
        return (await response.json());
    }
};

export const getOneType = (id) => async (dispatch) => {
    const response = await fetch(`/api/type/${id}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(loadTypes(data));
    } else {
        return (await response.json());
    }
};

export const typeByName = (type) => async (dispatch) => {
    const response = await fetch(`/api/type?type=${type}`);
    if (response.ok) {
        const data = await response.json();
        return data
    } else {
        return (await response.json());
    }
};

const initialState = { types: null };

const types = (state = initialState, action) => {
    // const newState = { ...state }
    switch (action.type) {
        case LOAD_TYPES:
            return { ...action.payload }
        default:
            return state;
    }
}


export default types;