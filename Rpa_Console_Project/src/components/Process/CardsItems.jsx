import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { HiInformationCircle } from "react-icons/hi2";
import { RxCross1 } from "react-icons/rx";
import { BsFillFileEarmarkPlayFill } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { Drawer } from "vaul";


function CardsItems({
  ID,
  title,
  desc,
  freq,
  isActive,
  lob,
  time,
  expressions,
  refresh,
  setRefresh,
}) {
  const parameter = ID;
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [logs, setLogs] = useState([]);

  async function onClickHandle() {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URI}/api/process/run/${parameter}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      toast.success(response.data.detail[0]);
    } catch (error) {
      toast.error(error.response.data.detail[0]);
    }
  }

  //getting log data
  async function fetchLogDetails() {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URI}/api/process/logs/${ID}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      // console.log(response.data.data);
      setLogs(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }
  //edit process
  const [formData, setFormData] = useState({
    newTitle: title,
    newPath: desc,
    newSelectedLob: lob,
    newExpressions: expressions,
  });

  const { newTitle, newPath, newSelectedLob, newExpressions } = formData;

  function onChange(e) {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
    // }
  }

  // console.log(formData);
  const [edited, setEdited] = useState(false);

  async function onSubmitHandler(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URI}/api/process/${ID}/`,
        {
          name: newTitle,
          path: newPath,
          expressions: newExpressions,
          lob: newSelectedLob,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      //console.log(response.data.detail[0]);
      setEdited(true);
      toast.success(response.data.detail[0]);
      setTimeout(()=> setShowEditModal(false), 3000);
      setTimeout(()=> setRefresh(!refresh), 3200);
      

      
    } catch (error) {
      // console.log(error);
      toast.error(error.response.data.path)
      // toast.error(error.data)
    }
  }

  const [lobName, setLobName] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URI}/api/process/lobs/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const val = [];
        for (let i = 0; i < response.data.data.length; i++) {
          val.push(response.data.data[i]);
        }
        // console.log(val);
        setLobName(val);

        // console.log(lobName);
      } catch (error) {
        console.log("Error : ", error);
      }
    };

    fetchData();

    const foundLob = lobName.find((item) => item.lob === lob);
    const lobId = foundLob ? foundLob.id : 1;
    setFormData({
      newTitle: title,
      newPath: desc,
      newSelectedLob: lobId,
      newExpressions: expressions,
    });
  }, [showModal, showEditModal ]);

  useEffect(() => {
    if (showEditModal === false && edited === true) {
      setRefresh(!refresh);
    }
  }, [edited]);

  return (
    <li className="py-3 sm:py-4">
      <div className="flex items-center ">
        {/* log left side offCanvas */}
        <Drawer.Root direction="left">
          <Drawer.Trigger asChild>
            <div className="flex-shrink-0 mr-7" onClick={fetchLogDetails}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="absolute w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
                />
              </svg>

              <span className="relative inset-0 object-right-top -mr-6 left-3 top-2">
                <div className="inline-flex items-center justify-center px-1.5 py-0.5 border-2 border-white w-6 h-6 rounded-full text-xs font-semibold leading-4 bg-red-500 text-white">
                  {freq}
                </div>
              </span>
            </div>
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40" />
            <Drawer.Content className="bg-white flex flex-col border-none h-full lg:w-[400px] w-[380px] mt-24 fixed bottom-0 left-0">
              <div className="max-w-md w-full mx-auto flex flex-col overflow-auto p-4 rounded-t-[10px]">
                <div className="max-w-md mx-auto">
                  <Drawer.Title className="font-medium mb-4">
                    Log Details
                  </Drawer.Title>
                  {logs.map((item, index) => (
                    <div className="flex justify-between items-center mb-2  relative  bg-white shadow-lg lg:rounded-3xl rounded-3xl lg:p-2 p-2 bg-clip-padding bg-opacity-60 border border-gray-200">
                      {item.is_ran ? (
                        <p className="text-zinc-600 mb-2 mr-2 border-r-4 border-green-500 p-2">
                          {index + 1}
                        </p>
                      ) : (
                        <p className="text-zinc-600 mb-2 mr-2 border-r-4 border-yellow-500 p-2">
                          {index + 1}
                        </p>
                      )}

                      <p className="text-zinc-600 mb-2">{item.log}</p>
                      <p className="text-zinc-600 mb-2">{item.created_on}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>

        <div className="flex-1 min-w-0 ms-4">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-white truncate dark:text-white">
              {title}
            </p>

            <HiInformationCircle
              type="button"
              onClick={() => setShowModal(true)}
              className="text-2xl  text-center"
            />
            <FaEdit
              type="button"
              onClick={() => setShowEditModal(true)}
              className="text-xl  text-center"
            />
          </div>

          <p className="text-sm text-gray-400 truncate dark:text-gray-400">
            {desc}
          </p>
          <div className="flex justify-between pr-3 min-w-0">
            <div className="flex justify-center items-center text-sm font-medium text-white dark:text-white">
              Status :
              {isActive === "Completed" ? (
                <div className="w-2 h-2 ml-2 rounded-full bg-green-600 shadow-2xl ring ring-green-600 ring-opacity-50"></div>
              ) : isActive === "Error" ? (
                <div className="w-2 h-2 ml-2 rounded-full bg-red-600 shadow-2xl ring ring-red-600 ring-opacity-50"></div>
              ) : isActive === "Running" ? (
                <div className="w-2 h-2 ml-2 rounded-full bg-yellow-600 shadow-2xl ring ring-yellow-600 ring-opacity-50"></div>
              ) : isActive === "Scheduled" ? (
                <div className="w-2 h-2 ml-2 rounded-full bg-blue-600 shadow-2xl ring ring-blue-600 ring-opacity-50"></div>
              ) : (
                ""
              )}
            </div>
            <p className="text-sm text-gray-400 truncate dark:text-gray-400">
              <a href="">{time}</a>
            </p>
          </div>
        </div>

        {/* popup icon */}
        <div className="inline-flex items-center text-base font-semibold text-white dark:text-white">
          <div>
            <button
              onClick={onClickHandle}
              className="text-white p-1 bg-[#ec1d23] hover:bg-gradient-to-r from-gray-800 to-gray-900 hover:ring-2 focus:ring-4 focus:outline-none focus:ring-blue-800 dark:focus:ring-blue-800  font-medium rounded-full text-sm text-center me-2"
            >
              <BsFillFileEarmarkPlayFill className="text-3xl" />
            </button>
          </div>
        </div>
      </div>

      {/* popup screen*/}
      {showModal ? (
        <>
          <div className="flex backdrop-blur-[1px] transition justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl ">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full  bg-white dark:bg-gray-700  outline-none focus:outline-none">
                <div className="flex justify-between items-center space-x-3 p-5 border-b border-solid border-gray-300 rounded-t ">
                  <h3 className="text-xl text-gray-900 dark:text-white font-semibold">
                    {title}
                  </h3>

                  <RxCross1
                    onClick={() => setShowModal(false)}
                    className="text-2xl text-gray-900 dark:text-white"
                  />
                </div>
                <div className="relative p-6 flex-auto text-gray-900 dark:text-white ">
                  <h3>Lob Name : {lob}</h3>
                  <h4>Path : {desc}</h4>
                  <h5>Logs : {freq}</h5>
                  <h5>Status : {isActive}</h5>
                  <h6>Time : {time}</h6>
                  <h6>Expressions : {expressions}</h6>
                </div>
             
              </div>
            </div>
          </div>
        </>
      ) : null}

      {/* edit process */}
      {showEditModal && (
        <div>
          <div className="flex backdrop-blur-[1px] transition justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative p-4 w-full max-w-md max-h-full">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Edit Process
                  </h3>
                  <button
                    className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={() => setShowEditModal(false)}
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                 
                  </button>
                </div>

                <form className="p-4 md:p-5" onSubmit={onSubmitHandler}>
                  <div className="grid gap-4 mb-4 grid-cols-1">
                    <div className="col-span-2">
                      <label
                        htmlFor="newTitle"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Process Title
                      </label>
                      <input
                        type="text"
                        name="newTitle"
                        id="newTitle"
                        value={newTitle}
                        onChange={onChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Type process title"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <label
                        htmlFor="newPath"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Process Path
                      </label>
                      <input
                        type="text"
                        name="newPath"
                        id="newPath"
                        value={newPath}
                        onChange={onChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Give process path"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="">
                        <label
                          htmlFor="newSelectedLob"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Select Lob
                        </label>
                        <select
                          id="newSelectedLob"
                          name="newSelectedLob"
                          value={newSelectedLob} // Assuming `selectedLob` holds the scalar value of the selected option
                          onChange={onChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        >
                          <option value="" disabled hidden>
                            {lob}
                          </option>
                          {lobName.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.lob}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="">
                        <label
                          htmlFor="newExpressions"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Expressions
                        </label>
                        <input
                          type="text"
                          name="newExpressions"
                          id="newExpressions"
                          value={newExpressions}
                          onChange={onChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Type process title"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="text-white inline-flex items-center bg-[#ec1d23] shadow-red-800/80 dark:shadow-lg dark:shadow-red-800/80 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    <svg
                      className="me-1 -ms-1 w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Edit Process
                  </button>
                </form>
              </div>
            </div>
          </div>

          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition:Bounce
          />
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition:Bounce
      />
    </li>
  );
}

export default CardsItems;
