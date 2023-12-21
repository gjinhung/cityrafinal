// constants
const ADD_CITY = 'city/ADD_CITY'
const LOAD_CITIES = "city/LOAD_CITIES";

const loadCities = (data) => ({
    type: LOAD_CITIES,
    payload: data,
});

const addCity = (data) => ({
    type: ADD_CITY,
    payload: data,
});

export const getCities = () => async (dispatch) => {
    const response = await fetch(`/api/city`);
    if (response.ok) {
        const data = await response.json();
        dispatch(loadCities(data));
    } else {
        return (await response.json());
    }
};

export const getOneCity = (id) => async (dispatch) => {
    const response = await fetch(`/api/city/${id}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(loadCities(data));
    } else {
        return (await response.json());
    }
};

export const cityByName = (city) => async (dispatch) => {
    const response = await fetch(`/api/city?city=${city}`);
    if (response.ok) {
        const data = await response.json();
        return data
    } else {
        return (await response.json());
    }
};

export const newCity = (city) => async (dispatch) => {
    const response = await fetch(`/api/city/new`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(city),
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(addCity(data))
        return data
    } else {
        return (await response.json());
    }
};

const initialState = { cities: null };

const cities = (state = initialState, action) => {
    let newState = {}
    switch (action.type) {
        case LOAD_CITIES:
            return { ...action.payload }
        case ADD_CITY:
            newState = {
                ...state,
                [action.payload.id]: action.payload
            }
            return newState
        default:
            return state;
    }
}


export default cities;