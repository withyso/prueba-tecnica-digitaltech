const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			allPost: [],
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			signUpUser: async (userData) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + '/api/signup', {
						method: 'POST',
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(userData)
					});

					if (!response.ok) {
						const errorData = await response.json()
						throw new Error(errorData.msg)
					}

					const data = await response.json();
					return { success: true, message: "usuario creado con exito" };
				} catch (error) {
					return { success: false, message: error.message }
				}
			},

			login: async (userData) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + '/api/login', {
						method: 'POST',
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(userData)
					});

					if (!response.ok) {
						const errorData = await response.json()
						throw new Error(errorData.msg)
					}

					const data = await response.json();
					localStorage.setItem("access_token", data.access_token);
					return { success: true, message: "Inicio de sesion exitoso" };
				} catch (error) {
					return { success: false, message: error.message }
				}
			}
			,

			createPost: async (token, postData) => {
				console.log(token)
				try {
					const response = await fetch(process.env.BACKEND_URL + '/api/createpost', {
						method: 'POST',
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${token}`
						},
						body: JSON.stringify(postData)
					});

					if (!response.ok) {
						const errorData = await response.json()
						throw new Error(errorData.msg)
					}

					const data = await response.json();
					return { success: true, msg: data.msg, post: data.post };
				} catch (error) {
					return { success: false, message: error.message }
				}
			},

			getAllPost: async (token) => {
				const response = await fetch(process.env.BACKEND_URL + '/api/feed', {
					method: 'GET',
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${token}`
					}
				})
				if (!response.ok) {
					if (response.status === 401) {
						return ({ msg: 'Token invalido o expirado', code: '401' })
					} else {
						const errorData = await response.json();
						throw new Error(errorData)
					}
				}

				const data = await response.json();
				setStore({ allPost: data })
				return { success: true, data }
			},

			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;
