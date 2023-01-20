import React from 'react';
const starFilled = null; //to be changed
const star = null; // to be changed

export default ({ rating = 0 }) => (
  <div className="rating">
    {[...Array(rating || 0)].map((e, i) => (
      <img key={i} src={starFilled} />
    ))}
    {[...Array(5 - rating || 0)].map((e, i) => (
      <img key={i} src={star} />
    ))}
  </div>
);
