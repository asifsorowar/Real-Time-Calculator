import React, { useState, useEffect, useRef } from "react";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import Card from "./components/Card";
import From from "./components/Form";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Modal from "./components/Modal";
import { io } from "socket.io-client";
import { types } from "./reducer/reducer";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import {
  createCalculation,
  getCalculations,
} from "./service/calculatorService";
import { useStateProvider } from "./reducer/provider";

let offset = 0;
let checkAll = false;
let limit = 10;

function App() {
  const [{ selectedCalculation, calculations, createdCalculation }, dispatch] =
    useStateProvider();

  const [formInputs, setFormInputs] = useState({
    title: "",
    file: "",
  });
  const [loader, setLoader] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const socket = useRef();

  const getAllCalculations = async () => {
    if (checkAll) return;

    try {
      if (offset < 1 && calculations.length > 0) return;

      let { data } = await getCalculations(offset, limit);
      if (data.length < limit) checkAll = true;

      let newCalculations = [...calculations, ...data];
      newCalculations = [
        ...new Map(newCalculations.map((item) => [item["_id"], item])).values(),
      ];

      dispatch({
        type: types.add_Calculations,
        calculations: newCalculations,
      });
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    socket.current = io("ws://localhost:8800");
    setLoadMore(true);
    getAllCalculations();
    setLoadMore(false);
  }, []);

  useEffect(() => {
    socket.current.on("getUpdate", (data) => {
      if (data.result)
        dispatch({
          type: types.createdCalculation,
          createdCalculation: data,
        });
    });
  }, []);

  useEffect(() => {
    if (createdCalculation?.result) {
      let newCalculations = [createdCalculation, ...calculations];
      newCalculations = [
        ...new Map(newCalculations.map((item) => [item["_id"], item])).values(),
      ];
      dispatch({
        type: types.add_Calculations,
        calculations: newCalculations,
      });
    }
  }, [createdCalculation]);

  const handleChange = (item) => {
    if (item.name === "file") {
      setFormInputs({ ...formInputs, [item.name]: item.files[0] });
    } else setFormInputs({ ...formInputs, [item.name]: item.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let data;
    setLoader((current) => !current);
    try {
      data = await createCalculation(formInputs);
      if (data.data.result) socket.current.emit("setUpdate", data.data);
      setFormInputs({ title: "", file: "" });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data);
        console.log(error.response.data);
      }
    }
    setLoader((current) => !current);
  };

  const handleSeeInput = (item) => {
    setIsModal((current) => !current);
    dispatch({
      type: types.add_selectedCalculation,
      selectedCalculation: item,
    });
  };

  const handleScroll = async (e) => {
    if (checkAll || loadMore) return;

    if (e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight) {
      offset = offset + 10;
      setLoadMore(true);
      await getAllCalculations();
      setLoadMore(false);
    }
  };

  return (
    <div className="bg-gray-500 w-screen h-screen flex justify-center items-center">
      <ToastContainer />
      <div className="container h-5/6 w-11/12 lg:w-2/6 lg:h-11/12 bg-gray-200 border-gray-700 border-2">
        <div className="container flex flex-col h-full">
          <div
            className="overflow-y-auto grow border-b-2 border-gray-700"
            onScroll={handleScroll}
          >
            <h1 className="text-xl font-bold p-2 sticky top-0 bg-gray-200">
              Total results: {calculations.length}
            </h1>

            <DragDropContext>
              <Droppable droppableId="cards">
                {(provided) => (
                  <div
                    className="container p-2"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {calculations.map((item, index) => (
                      <Draggable
                        key={item._id}
                        draggableId={item._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Card item={item} handleSeeInput={handleSeeInput} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {loadMore && (
                      <div className="w-full flex justify-center items-center mt-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          <div className="container p-2">
            <h1 className="text-xl font-bold pb-2">Input</h1>
            <From
              formInputs={formInputs}
              onChange={handleChange}
              handleSubmit={handleSubmit}
              loader={loader}
            />
          </div>
        </div>
      </div>
      {isModal && (
        <Modal
          selectedItem={selectedCalculation}
          onCancel={() => setIsModal((current) => !current)}
        />
      )}
    </div>
  );
}

export default App;
