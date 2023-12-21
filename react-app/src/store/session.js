// constants
const SET_USER = "session/SET_USER";
const REMOVE_USER = "session/REMOVE_USER";

const setUser = (user) => ({
	type: SET_USER,
	payload: user,
});

const removeUser = () => ({
	type: REMOVE_USER,
});

const initialState = { user: null };

export const authenticate = () => async (dispatch) => {
	const response = await fetch("/api/auth/", {
		headers: {
			"Content-Type": "application/json",
		},
	});
	if (response.ok) {
		const data = await response.json();
		if (data.errors) {
			return data;
		}
		dispatch(setUser(data));
	} else {
		console.log(response)
	}
};

export const login = (email, password) => async (dispatch) => {
	const response = await fetch("/api/auth/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email,
			password,
		}),
	});

	if (response.ok) {
		const data = await response.json();
		dispatch(setUser(data));
		return null;
	} else if (response.status < 500) {
		const data = await response.json();
		if (data.errors) {
			return data.errors;
		}
	} else {
		return ["An error occurred. Please try again."];
	}
};

export const logout = () => async (dispatch) => {
	console.log('logout attempt')
	const response = await fetch("/api/auth/logout", {
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (response.ok) {
		dispatch(removeUser());
	}
};

export const signUp = (userData) => async (dispatch) => {
	const response = await fetch("/api/auth/signup", {
		method: "POST",
		// headers: {
		//     "Content-Type": "application/json"
		// },
		body: userData,
	});
	console.log(" THIS IS IMAGE DATA", userData)
	console.log(response)
	if (response.ok) {
		const data = await response.json();
		console.log('response ok')
		dispatch(setUser(data));;
	} else if (response.status < 500) {
		console.log('response < 500')
		const data = await response.json();
		if (data.errors) {
			return data.errors;
		}
	} else {
		console.log('response else')
		const data = response.json();
		console.log(data)
		return ["An error occurred. Please try again."];
	}
};

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case SET_USER:
			return { user: action.payload };
		case REMOVE_USER:
			return { user: null };
		default:
			return state;
	}
}