import { CHECK_USER, SIGNUP, CAMPAIGN_UUID, types } from "./constants";

const getBody = {
	[CHECK_USER]: (email) =>
		JSON.stringify({
			campaignUuid: CAMPAIGN_UUID,
			data: { email },
		}),
	[SIGNUP]: (data) =>
		JSON.stringify({
			campaignUuid: CAMPAIGN_UUID,
			data,
		}),
};

const headers = {
	"content-type": "application/json",
};

export function checkIfEmailExists(email) {
	return new Promise(function (resolve, reject) {
		fetch(CHECK_USER, {
			method: "POST",
			headers,
			body: getBody[CHECK_USER](email),
		})
			.then((response) => response.json())
			.then(({ data }) => {
				if (data.status === types.EMAIL_EXISTS)
					reject("Account already exists, please choose a new email address");
				else if (data.status === types.NEW_EMAIL) resolve();
			})
			.catch((error) => reject(error));
	});
}

export function newUserData(payload) {
	return new Promise(function (resolve, reject) {
		fetch(SIGNUP, {
			method: "POST",
			headers,
			body: getBody[SIGNUP](payload),
		})
			.then((response) => response.json())
			.then(({ message, errors, status }) => {
				if (status >= 400 && errors && errors.length) reject(errors);
				resolve(message);
			})
			.catch((error) => console.error(error));
	});
}
