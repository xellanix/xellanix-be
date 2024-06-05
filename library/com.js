/*
MIT License

Copyright (c) 2024 xellanix

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

let talk = async function (res, url = "http://localhost:3000/api/", type = "json", bodyData = {}) {
	try {
		// Use fetch to make an internal request to another route
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": type === "json" ? "application/json" : "application/text",
			},
			body: type === "json" ? JSON.stringify(bodyData) : bodyData,
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Internal request failed with status ${response.status}: ${errorText}`);
		}

		return response;
	} catch (error) {
		console.error("Error:", error.message);
		res.status(500).send("Internal Server Error");
	}
};

let listen = async function (res, url = "http://localhost:3000/api/", type = "json") {
	try {
		// Use fetch to make an internal GET request to another route
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": type === "json" ? "application/json" : "application/text",
			},
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Internal request failed with status ${response.status}: ${errorText}`);
		}

		return response;
	} catch (error) {
		console.error("Error:", error.message);
		res.status(500).send("Internal Server Error");
	}
};

let com = { talk, listen };

module.exports = com;
