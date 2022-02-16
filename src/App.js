import React, { useState, useEffect, useRef } from "react";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { io } from "socket.io-client";
import { types } from "./reducer/reducer";
import Card from "./components/Card";
import From from "./components/Form";
import Modal from "./components/Modal";
import {
  createCalculation,
  getCalculations,
} from "./service/calculatorService";
import { useStateProvider } from "./reducer/provider";
import Loader from "./components/Loader";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";

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
  const [showFile, setShowFile] = useState(false);
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
    socket.current = io(process.env.REACT_APP_SOCKET_API_URL);
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
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data);
        console.log(error.response.data);
      }
    }
    setFormInputs({ file: "", title: "" });
    setLoader((current) => !current);
  };

  const handleSeeInput = (item) => {
    setIsModal((current) => !current);
    setShowFile(true);
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
    <>
      <ToastContainer />
      <div className="bg-gray-500 w-screen h-screen flex flex-col justify-center items-center">
        <div className="container h-5/6 w-11/12 lg:w-2/6 lg:h-11/12 bg-gray-200 border-gray-700 border-2">
          <div className="container flex flex-col h-full">
            <div
              className="overflow-y-auto grow border-b-2 border-gray-700"
              onScroll={handleScroll}
            >
              <div className="container flex justify-between items-center p-2 sticky top-0 bg-gray-200">
                <h1 className="text-xl font-bold">
                  Total results: {calculations.length}
                </h1>
                <button
                  onClick={() => {
                    setIsModal((current) => !current);
                    setShowFile(false);
                  }}
                  className="mr-2 rounded-2xl border-2 border-gray-500 text-gray-700 p-1 px-2 md:p-1.5 md:px-5 hover:bg-white"
                >
                  Instruction
                </button>
              </div>

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
                              <Card
                                item={item}
                                handleSeeInput={handleSeeInput}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      <Loader load={loadMore} />
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

        <Modal
          selectedItem={selectedCalculation}
          isLoad={isModal}
          showFile={showFile}
          onCancel={() => setIsModal((current) => !current)}
        />
      </div>
    </>
  );
}

export default App;
