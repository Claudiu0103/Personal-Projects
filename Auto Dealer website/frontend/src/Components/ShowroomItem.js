import React from 'react';
//import '../Styles/ShowroomItem.css';

function ShowroomItem({ showroom }) {
    return (
        <div className="showroom-item">
            <h3>{showroom.name}</h3>
            <p><strong>Location:</strong> {showroom.location}</p>
            <p><strong>Phone Number:</strong> {showroom.phoneNumber}</p>
            <p><strong>Email:</strong> {showroom.email}</p>
        </div>
    );
}

export default ShowroomItem;
