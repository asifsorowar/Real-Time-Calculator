import React from "react";

const Modal = ({ selectedItem, onCancel, isLoad, showFile }) => {
  return (
    isLoad && (
      <div className="absolute top-50% left-50% h-full w-full lg:h-5/6 lg:w-5/6 bg-white flex justify-center items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 absolute right-2 top-2 cursor-pointer text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          onClick={onCancel}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
          />
        </svg>

        {showFile ? (
          <iframe
            src={`${process.env.REACT_APP_API_URL}/files/${selectedItem.file}`}
            title="seeFile"
            frameBorder="0"
            height="500"
            width="60%"
          ></iframe>
        ) : (
          <div className="text-left text-gray-600">
            <h1 className="text-xl font-bold mb-2">SAMPLE INPUT TEXT FILE:</h1>
            <ul className="list-disc ml-9">
              <li className="text-lg">
                <a
                  href={`${process.env.REACT_APP_API_URL}/files/sample1.txt`}
                  target="_blank"
                  className="text-cyan-400 hover:underline"
                >
                  calculation1.txt
                </a>
              </li>
              <li className="text-lg mb-2">
                <a
                  href={`${process.env.REACT_APP_API_URL}/files/sample2.txt`}
                  target="_blank"
                  className="text-cyan-400 hover:underline"
                >
                  calculation2.txt
                </a>
              </li>
            </ul>

            <h1 className="text-lg font-bold mb-2">
              VALID CALCULATION FORMAT:
            </h1>
            <ul className="list-disc ml-9">
              <li className="text-lg">1+8+3+9-8+0/2</li>
              <li className="text-lg">.0574*75-41/81</li>
              <li className="text-lg">-10-20</li>
              <li className="text-lg">10+-30++40--30.05/2</li>
              <li className="text-lg">10+- 30++40 -30.05 /2</li>
            </ul>
            <h1 className="text-lg font-bold mb-2 mt-5">
              INVALID CALCULATION FORMAT:
            </h1>
            <ul className="list-disc ml-9">
              <li className="text-lg">10+asdw4-3/2</li>
              <li className="text-lg">*10+-3//2</li>
              <li className="text-lg">-10**20</li>
            </ul>
          </div>
        )}
      </div>
    )
  );
};

export default Modal;
