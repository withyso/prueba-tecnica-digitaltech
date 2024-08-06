import React, { useState, useEffect } from 'react'


const Post = ({ message, author, location, imageUrl }) => {
    const [liked, setLiked] = useState(false)

    const handleLike = () => {
        setLiked(!liked);
    };

    return (
        <React.Fragment>
            <div className="feedPost d-flex flex-column align-items-center pt-3">
                <span>{location}</span>
                <img src={imageUrl} alt="Imagen del post" className="post-image image" />
                <div className="post-content container-fluid gap-4">
                    <p className='fs-5 text-center'> {message} </p>
                    <i class="fa-regular fa-heart" onClick={handleLike} style={{ fontSize: '30px', color: liked ? 'red' : 'gray' }}></i>
                    <p className='mt-4'><strong>{author}</strong></p>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Post