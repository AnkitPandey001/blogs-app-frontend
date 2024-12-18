import { useLocation } from 'react-router-dom';
import { CardMedia } from '@mui/material';

export const CompleteDescBlogs = () => {
    const location = useLocation();
    const { post } = location.state;

    const { title, user, text, createdAt, comments, img } = post;
    const { fullname, username } = user;

    return (
        <div className="mt-28 mx-auto max-w-4xl bg-gray-900 text-gray-100 p-6 rounded-lg shadow-lg">
            {/* Post Title */}
            <h1 className="text-4xl font-bold mb-6">{title}</h1>

            {/* User Info Section */}
            <div className="flex items-center mb-6">
                <img
                    src={user.profileImg}
                    alt="Profile"
                    className="w-12 h-12 rounded-full mr-4 border border-gray-700"
                />
                <div>
                    <h2 className="text-xl font-semibold">{fullname}</h2>
                    <p className="text-sm text-gray-400">@{username}</p>
                    <p className="text-sm text-gray-400">Published on: {new Date(createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            {/* Post Image Section */}
            <CardMedia
                component="img"
                alt="Post Cover"
                image={img}
                title={title}
                className="w-full h-80 object-cover rounded-lg mb-6 border border-gray-700"
            />

            {/* Post Content */}
            <p className="text-gray-300 mb-4">{text}</p>

            {/* Like and Comment Section */}
            <div className="flex items-center space-x-4 mb-6">
                {/* Comments */}
                <div className="flex items-center space-x-1 text-sm text-gray-400">
                    <span>Comments:</span>
                    <span>{comments.length}</span>
                </div>
            </div>
        </div>
    );
};
