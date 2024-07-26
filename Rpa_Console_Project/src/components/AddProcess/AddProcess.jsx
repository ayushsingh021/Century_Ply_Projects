import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function AddProcess({ showModal, setShowModal, refresh, setRefresh}) {

  const [formData, setFormData] = useState({
    title: "",
    path: "",
    selectedLob: "",
    expressions:"",
  });

  const { title, path,selectedLob,expressions } = formData;

  function onChange(e) {
    const { id, value } = e.target;
      setFormData(prevState => ({
        ...prevState,
        [id]: value
      }));
    // }
  }
  
  // console.log(formData);
  async function onSubmitHandler(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    // console.log(formData);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URI}/api/process/`,  {
        name: title,
        path: path,
        expressions : expressions,
        lob: selectedLob
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        }
      });

      toast.success(response.data.detail[0])
      setFormData({
        title: "",
        path: "",
        selectedLob: "",
        expressions:"",
      })
      setShowModal(false)
      // console.log(response.data.detail[0]);
    } catch (error) {
      // console.log(error.response.data)
      toast.error(error.response.data.path)
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
  }, [showModal]);

  useEffect(()=>{
    setFormData({
      title: "",
      path: "",
      selectedLob: "",
      expressions:"",
    })
  },[refresh])

  
  return (
    <>
      {showModal && (
        <div>
          <div className="flex backdrop-blur-[1px] transition justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Add New Process
                </h3>
                <button
                  className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => setShowModal(false)}
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
                      htmlFor="title"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Process Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={title}
                      onChange={onChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type process title"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="path"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Process Path
                    </label>
                    <input
                      type="text"
                      name="path"
                      id="path"
                      value={path}
                      onChange={onChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Give process path"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                  <div className="">
                    <label
                      htmlFor="selectedLob"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Select Lob
                    </label>
                    <select
                      id="selectedLob"
                      name="selectedLob"
                      value={selectedLob} // Assuming `selectedLob` holds the scalar value of the selected option
                      onChange={onChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    >
                      <option value="" disabled hidden>Select an option</option>
                      {lobName.map((item) => (
                        <option key={item.id} value={item.id} >
                          {item.lob}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="">
                    <label
                      htmlFor="expressions"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Expressions
                    </label>
                    <input
                      type="text"
                      name="expressions"
                      id="expressions"
                      value={expressions}
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
                  Add New Process
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
    </>
  );
}

export default AddProcess;
