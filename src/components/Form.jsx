import React from "react";

const From = ({ formInputs, onChange, handleSubmit, loader }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center">
        <input
          type="text"
          name="title"
          className="p-2 rounded-sm border-gray-800 border shadow-sm border-slate-300 focus:outline-none placeholder-gray-600 font-normal w-10/12"
          placeholder="Calculation Title"
          value={formInputs.title}
          onChange={(e) => onChange(e.target)}
          required
        ></input>
        <h1 className="text-xs text-gray-600 pl-5">Required</h1>
      </div>
      <div className="flex items-center">
        <div className="flex flex-col justify-end items-center p-5 pb-1 border-2 border-gray-400 w-10/12 mt-2 relative">
          <input
            type="file"
            accept="text/plain"
            className="opacity-0 font-normal w-full h-full bg-red-400 absolute top-0 left-0  cursor-pointer"
            name="file"
            onChange={(e) => onChange(e.target)}
          ></input>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h1 className="text-md text-gray-600">
            {!formInputs.file
              ? "Drop your calculation text file here"
              : formInputs.file.name}
          </h1>
        </div>
        <h1 className="text-md text-gray-600 pl-5">Optional</h1>
      </div>
      <div className="flex items-center h-100% w-100% mt-2">
        <button
          type="submit"
          className="rounded-2xl border-2 border-gray-500 text-gray-700 p-1 px-2 md:p-1.5 md:px-5 hover:bg-white"
          disabled={loader}
        >
          Calculate
        </button>
        {loader && (
          <h1 className="ml-3 text-gray-600">
            Calculating, Please wait.......
          </h1>
        )}
      </div>
    </form>
  );
};

export default From;
