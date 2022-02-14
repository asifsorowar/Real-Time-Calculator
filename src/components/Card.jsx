import React from "react";

const Card = ({ item, handleSeeInput, ...otherProps }) => {
  return (
    <div
      className="card rounded-xl bg-gray-100 border-gray-600 border-2 p-1.5 md:p-3 mt-2"
      {...otherProps}
    >
      <div className="container flex justify-between items-center">
        <h1>= {item.result}</h1>
        <h1 className="font-bold">{item.title}</h1>
        <button
          className="rounded-2xl bg-gray-500 p-1 px-2 md:p-1.5 md:px-5 text-white justify-self-start"
          onClick={() => handleSeeInput(item)}
        >
          See Input
        </button>
      </div>
    </div>
  );
};

export default Card;
