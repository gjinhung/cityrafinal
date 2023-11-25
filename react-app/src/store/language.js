// constants
const LOAD_LANGUAGES = "language/LOAD_LANGUAGES";
const POST_LANGUAGE = "langauge/POST_LANGUAGE"

const loadLanguages = (data) => ({
    type: LOAD_LANGUAGES,
    payload: data,
});

const postLanguage = (data) => ({
    type: POST_LANGUAGE,
    payload: data
})

export const getLanguages = () => async (dispatch) => {
    const response = await fetch(`/api/languages`);
    if (response.ok) {
        const data = await response.json();
        dispatch(loadLanguages(data));
    } else {
        return (await response.json());
    }
};


export const getOneLanguage = (id) => async (dispatch) => {
    const response = await fetch(`/api/languages/${id}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(loadLanguages(data));
    } else {
        return (await response.json());
    }
};

export const langByName = (language) => async (dispatch) => {
    const response = await fetch(`/api/languages?language=${language}`);
    if (response.ok) {
        const data = await response.json();
        return data
    } else {
        return (await response.json());
    }
};

export const newLanguage = (language) => async (dispatch) => {
    const response = await fetch(`/api/languages/new`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(language),
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(postLanguage(data));
        return data
    } else if (response.status < 500) {
        console.log('language posting failed')
        const data = await response.json();
        if (data.errors) {
            return data;
        }
    } else {
        return ["A new language error occurred. Please try again."];
    }
};

const initialState = { languages: null };

const languages = (state = initialState, action) => {
    const newState = { ...state }
    switch (action.type) {
        case LOAD_LANGUAGES:
            return { ...action.payload }
        case POST_LANGUAGE:
            const data = action.payload
            newState[data.id] = data
            return newState
        default:
            return state;
    }
}


export default languages;