import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import Post from "../component/Post";
import toast, { Toaster } from 'react-hot-toast';
import { showNotification } from '../utils/ShowToast';
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
	const navigate = useNavigate()
	const { actions, store } = useContext(Context)
	const [postData, setPostData] = useState({
		message: "",
		image: "",
		location: "",
	})
	const [posts, setPosts] = useState([])
	const token = localStorage.getItem('access_token')
	const postDataAll = []
	const { message, image, location } = postData

	useEffect(() => {
		validatingPost()
	}, [token])

	useEffect(() => {
		console.log(posts)
	}, [posts])

	const validatingPost = async () => {
		try {
			const updatePost = await actions.getAllPost(token)
			if (updatePost.code == 401) {
				showNotification("Tu token esta vencido o no es valido, redirigiendo a login", "error")
				setInterval(() => {
					navigate('/')
				}, 2500);
			}
			if (updatePost.success) {
				setPosts(updatePost.data)
			}
		} catch (error) {
			console.error(error)
			showNotification("No se ha podido cargar la informacion", "error")
		}
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setPostData((prevFormData) => ({
			...prevFormData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		console.log(postData);
		const result = await actions.createPost(token, postData)
		console.log(result)
		if (result.success) {
			showNotification(result.msg, "success")
			validatingPost()
			return;
		} else {
			return showNotification(result.message, "error")
		}
	};

	const handleLogout = () => {
		localStorage.removeItem('access_token')
		showNotification("logout satisfactorio", "success")
		navigate('/')
	}

	return (
		<React.Fragment>
			<div className="mt-5 container feed d-flex flex-column align-items-center p-4 gap-4">
				<h1 className='text-center mb-4 fs-1 text-secondary'>DTech Inc</h1>
				<div className="buttons d-flex flex-row gap-3">
					<button type="button" className="btn btn-danger" onClick={handleLogout}>Logout</button>
					<button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal">
						Crear post
					</button>
					<div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
						<div className="modal-dialog">
							<div className="modal-content">
								<div className="modal-header">
									<h5 className="modal-title text-center" id="exampleModalLabel">Nuevo Post</h5>
									<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
								</div>
								<div className="modal-body">
									<form action="" className=" d-flex flex-column gap-3">
										<div className="description-box d-flex flex-column">
											<label htmlFor="message">Cuerpo del mesaje</label>
											<textarea name="message" value={message} id="message" onChange={handleInputChange} placeholder="Descripcion de tu post" className="curvieStyle"></textarea>
										</div>
										<label htmlFor="image">Link URL de la imagen</label>
										<input type="text" name="image" value={image} id="image" onChange={handleInputChange} placeholder="Link de la imagen de tu post" className="curvieStyle" />
										<label htmlFor="location">Ubicación</label>
										<input type="text" name="location" value={location} id="location" onChange={handleInputChange} placeholder="Link de la imagen de tu post" className="curvieStyle" />
									</form>
								</div>
								<div className="modal-footer">
									<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
									<button type="button" className="btn btn-primary" onClick={handleSubmit} data-bs-dismiss="modal">Guardar cambios</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				{
					posts.data?.map((post) => {
						return (
							<Post
								message={post.message}
								imageUrl={post.image}
								author={post.author}
								location={post.location}
							/>
						)
					})
				}
			</div>
		</React.Fragment>
	);
};
