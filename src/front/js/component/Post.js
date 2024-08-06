import React from 'react'

const Post = ({ message, author, location, imageUrl }) => {

    console.log(imageUrl)
    return (
        <React.Fragment>
            <div className="feedPost d-flex flex-column align-items-center pt-3">
                <span>{location}</span>
                <img src={imageUrl} alt="Imagen del post" className="post-image image" />
                <div className="post-content container-fluid gap-4">
                    <p className='fs-5 text-center'> {message} </p>
                    <div className="post-actions pt-3">
                        <i className="far fa-heart" style={{ fontSize: '25px', marginLeft: '0.5em' }}></i>
                    </div>
                    <p className='mt-4'><strong>{author}</strong></p>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Post