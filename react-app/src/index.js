import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { LogInSignInProvider } from "./context/NavToggle";
import { ModalProvider, Modal } from "./context/Modal";
import { SearchProvider } from "./context/SearchBar";
import { ActiveTourProvider } from "./context/ActiveTours";
import { ActiveTourDetailsProvider } from "./context/ActiveTourDetails";
import configureStore from "./store";
import * as sessionActions from "./store/session";
import App from "./App";

import "./index.css";
import { NavScrollProvider } from "./context/NavScrollToggle";

const store = configureStore();

if (process.env.NODE_ENV !== "production") {
	window.store = store;
	window.sessionActions = sessionActions;
}

// Wrap the application with the Modal provider and render the Modal component
// after the App component so that all the Modal content will be layered as
// HTML elements on top of the all the other HTML elements:
function Root() {
	return (
		<ModalProvider>
			<Provider store={store}>
				<BrowserRouter>
					<LogInSignInProvider>
						<SearchProvider>
							<ActiveTourProvider>
								<ActiveTourDetailsProvider>
									<NavScrollProvider>
										<App />
										<Modal />
									</NavScrollProvider>
								</ActiveTourDetailsProvider>
							</ActiveTourProvider>
						</SearchProvider>
					</LogInSignInProvider>
				</BrowserRouter>
			</Provider >
		</ModalProvider >
	);
}

ReactDOM.render(
	<React.StrictMode>
		<Root />
	</React.StrictMode>,
	document.getElementById("root")
);