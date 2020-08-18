import React from "react";
import { checkIfEmailExists, newUserData } from "./source";
import { types } from "./constants";
import "./App.css";

function formDataReducer(state, { type, event }) {
	if (type === types.UPDATE_FORM) {
		if (!event.target) return state;
		return { ...state, [event.target.name]: event.target.value };
	}
	return state;
}

function App() {
	const [formData, formDispatch] = React.useReducer(formDataReducer, {
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	});
	const [disabled, setDisabled] = React.useState(true);
	const [emailError, setEmailError] = React.useState(false);
	const [formError, setFormError] = React.useState("");
	const [success, setSuccess] = React.useState(false);

	const { firstName, lastName, email, password } = formData;

	function updateFormData(event) {
		event.persist();
		formDispatch({ type: types.UPDATE_FORM, event });
	}

	function publishFormData(event) {
		event.preventDefault();
		const data = new FormData(event.target);
		const payload = Object.fromEntries(data);
		newUserData(payload)
			.then((data) => setSuccess(data))
			.catch((err) => {
				if (err && err.length) {
					const errorMessage = err.map((e) => e.message).join("");
					setFormError(errorMessage);
				} else setFormError();
			});
	}

	function checkIfValid(event) {
		const validateEmail = event.target.value || email;
		if (validateEmail)
			checkIfEmailExists(validateEmail)
				.then(() => setEmailError())
				.catch((err) => setEmailError(err));
		else setEmailError(false);
	}

	React.useEffect(() => {
		const inputs = [firstName, lastName, email, password];
		setDisabled(!inputs.every(Boolean) || emailError);
	}, [firstName, lastName, email, password, emailError]);

	return (
		<div className="container">
			{success ? (
				<div className="form-container"> {success}</div>
			) : (
				<form
					className="form-container"
					onChange={updateFormData}
					onSubmit={publishFormData}
				>
					<h1>Sign up</h1>
					<input
						name="firstName"
						value={firstName}
						placeholder="First Name"
						required
					/>
					<input
						name="lastName"
						value={lastName}
						placeholder="Last Name"
						required
					/>
					<input
						className={emailError ? "error" : ""}
						name="email"
						value={email}
						type="email"
						placeholder="Email address"
						onBlur={checkIfValid}
						required
					/>
					<div className="error">{emailError}</div>
					<input
						name="password"
						value={password}
						type="password"
						placeholder="Password"
						required
					/>
					<input type="submit" disabled={disabled} value="Sign up" />
					<div className="error">{formError}</div>
				</form>
			)}
		</div>
	);
}

export default App;
