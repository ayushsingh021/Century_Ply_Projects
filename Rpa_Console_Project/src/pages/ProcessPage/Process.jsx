import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { RiRefreshLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { IoAdd } from "react-icons/io5";

import CardsItems from "../../components/Process/CardsItems";
import FiltersOffCanvas from "../../components/Filters/FiltersOffCanvas"
import Loader from "../../components/Loader/Loader"
import Pagination from "../../components/Paginations/Pagination"

import AddProcess from "../../components/AddProcess/AddProcess"
import Logout from "../../components/Logout/Logout"

function Process() {
 
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state;
  // console.log(user);

  const [processInfo, setProcessInfo] = useState([]); // array of objects
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);

  
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);

  function onRefresh() {
    setRefresh(true);
    if (refresh) {
      <Loader />;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URI}/api/process/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        // console.log(response);
        const val = [];
        for (let i = 0; i < response.data.data.length; i++) {
          val.push(response.data.data[i]);
        }
        // console.log(val);
        setProcessInfo(val);

      } catch (error) {
        if (error.response && error.response.status === 401) {
          // console.error('Unauthorized. Redirecting to login page...');
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          // Other error handling
          console.error("Logout error:", error);
          // Handle other errors as needed
        }
      }
    };
    fetchData();
    setTimeout(() => setRefresh(false), 700);
  }, [refresh,showModal]);



  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  // const currentRecords = processInfo.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(processInfo.length / recordsPerPage);

  //searching
  const [searchedItem, setSearchedItem] = useState({
    searched: "",
  });

  const { searched } = searchedItem;

  function onchangeHandler(e) {
    setSearchedItem((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  return (
    <div className="w-full max-w-2xl mx-auto shadow-md  rounded-lg px-4 py-3 m-5 text-white bg-gray-800">
      {refresh && <Loader />}
      <div className="">
        {/* TOPBAR */}

        <div className="flex items-center justify-between mb-4 ">
          <div className="flex justify-center space-x-2 items-center">
            <Logout />
           
            <button
              onClick={() => setShowModal(true)}
              className="w-md text-white  bg-yellow-400 shadow-yellow-400/40 dark:shadow-lg dark:shadow-yellow-400/40 hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-full text-sm px-1 py-1 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              <IoAdd
                // value={refresh}
                // onClick={onRefresh}
                className="text-lg text-center font-bold text-white"
              />
            </button>
            <button className="w-md text-white bg-green-600 shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-full text-sm px-1 py-1 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
              <RiRefreshLine
                value={refresh}
                onClick={onRefresh}
                className="text-lg rotate-[-90deg] text-center"
              />
            </button>

            {/* form popup     */}
          <AddProcess showModal={showModal} setShowModal={setShowModal} refresh = {refresh} setRefresh = {setRefresh}/>
          </div>

          <div className="flex w-1/3 ml-2">
            <h6 className="text-sm text-center font-thin-bold leading-none text-white dark:text-white">
              Hi Admin! Welcome to RPA Console 👋
            </h6>
          </div>

          <FiltersOffCanvas />
          
        </div>
        {/* SEARCHBAR */}
        <div className="relative">
          <div className="absolute inset-y-0 left-4 lg:start-4 flex items-center pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="searched"
            value={searched}
            onChange={onchangeHandler}
            className="block w-full lg:w-full p-2 pl-12 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search..."
            required
          />
        </div>
      </div>

      {/* PROCESSES BODY */}
      <div className="flow-root">
        <ul
          role="list"
          className="divide-y divide-gray-700 dark:divide-gray-700"
        >
          {/* .slice is for pagination */}
          {processInfo
            .slice(indexOfFirstRecord, indexOfLastRecord)
            .filter((item) =>
              item.name.toLowerCase().includes(searched.toLowerCase())
            )
            .map((item ,index) => (
              <CardsItems
                key={item.id}
                ID={item.id}
                title={item.name}
                desc={item.fromatted_path}
                freq={item.logs}
                lob={item.line_of_business}
                isActive={item.current_status}
                time={item.updated_on}
                expressions = {item.expressions}
                refresh = {refresh} 
                setRefresh = {setRefresh}
              />
            ))}
          {/* Conditional rendering for no matching items */}
          {/* .slice is for pagination */}

          {processInfo
            .slice(indexOfFirstRecord, indexOfLastRecord)
            .filter((item) =>
              item.name.toLowerCase().includes(searched.toLowerCase())
            ).length === 0 &&
            searched !== "" && (
              <div className="text-center">
                <p className="mb-4 text-lg text-gray-300">
                  Oops! No Process found.
                </p>
                <div className="animate-bounce">
                  <svg
                    className="mx-auto h-16 w-16 text-[#ec1d23]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    ></path>
                  </svg>
                </div>
                <p className="mt-4 text-gray-400">Please search correctly</p>
              </div>
            )}
        </ul>
      </div>
      {/* pagination */}
      <div className="flex justify-center">
        <Pagination
          nPages={nPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default Process;
