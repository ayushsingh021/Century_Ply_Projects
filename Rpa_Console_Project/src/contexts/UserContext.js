import { createContext } from "react";
import { useContext } from "react";

//not really used now --> but for more scalability and global data access in future can be used
export const UserContext = createContext({
    userInfo :{
        full_name :'Ayush',
        phone_no : '8272952701',
        email : 'ayush.singh0943@gmail.com'
    }
})

//custom hook
export const useUserInfo = () =>{
    return useContext(UserContext);
}

//provider
export const UserInfoProvider = UserContext.Provider;