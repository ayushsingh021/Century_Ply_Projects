import React from "react";
import { useNavigate } from "react-router-dom";
import { MdVisibilityOff, MdVisibility } from "react-icons/md";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [userdata, setUserdata] = useState({});

  const { email, password } = formData;

  async function onSubmit(e) {
    // console.log(formData.email);
    e.preventDefault();
    try {
  
      const response = await axios.post(`${import.meta.env.VITE_API_URI}/api/account/superuser/login/`, {
        username: email,
        password: password,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);
      // console.log(response.data.data);
      const userDataFromResponse = {
        full_name: response.data.data.full_name,
        phone_no: response.data.data.phone_no,
        email: response.data.data.email,
      };

      setUserdata(userDataFromResponse);
      // console.log(userdata);
      if (token) {
      } else {
        console.log(error);
       
      }

      // console.log(response);
    } catch (error) {
      // AxiosError
      if (error.response.status === 400) {
        if (error.response.data["username"]) {
          toast.error(error.response.data.username[0]);
        } else {
          toast.error(error.response.data.password[0]);
        }
      }
    }
  }

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  useEffect(() => {
    if (Object.keys(userdata).length !== 0) {
     
      navigate("/", { state: userdata });
    }
  }, [userdata, navigate]);

  return (
    <section>
      <div className=" flex flex-col items-center justify-center px-3 py-2 mx-auto min-h-screen lg:py-1">
        <img
          className="w-40 h-15 mb-2 mx-auto "
          src="https://zenlayercdn.centuryply.com/assets/img/logo.png"
          alt="logo"
        />
      
        <div className="w-full rounded-lg shadow-2xl border dark:border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 dark:bg-gray-800 border-gray-700 dark:border-gray-700">
          <div className="p-2 space-y-2 md:space-y-4 sm:p-8">
            <h1 className="text-xl text-center font-thin leading-tight tracking-tight text-white md:text-2xl dark:text-white">
              Login to your account
            </h1>
            <form
              onSubmit={onSubmit}
              className="space-y-4 md:space-y-1"
              action="#"
            >
              <div>
                <label
                  htmlFor="email"
                  className="text-start font-thin block mb-2 text-sm  text-white dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={onChange}
                  className="border   sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 dark:bg-gray-700 border-gray-600 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-400 text-white dark:text-white focus:ring-blue-500 dark:focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500"
                  placeholder="name@centuryply.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="text-start font-thin block mb-2 text-sm  text-white dark:text-white"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    className="border   sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 dark:bg-gray-700 border-gray-600 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-400 text-white dark:text-white focus:ring-blue-500 dark:focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500"
                    type={showPassword ? "text" : "Password"}
                    id="password"
                    value={password}
                    //tracks the ongoing changes
                    onChange={onChange}
                    placeholder="Password"
                    required
                  />
                  {showPassword ? (
                    <MdVisibilityOff
                      className="absolute right-3 top-3 text-white cursor-pointer text-xl"
                      onClick={() => setShowPassword((prevState) => !prevState)}
                    />
                  ) : (
                    <MdVisibility
                      className="absolute right-3 top-3 text-gray-300 cursor-pointer text-xl"
                      onClick={() => setShowPassword((prevState) => !prevState)}
                    />
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full text-white bg-[#ec1d23] shadow-red-800/80 dark:shadow-lg dark:shadow-red-800/80 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Login
                </button>
              </div>
            </form>
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
    </section>
  );
}

export default Login;
