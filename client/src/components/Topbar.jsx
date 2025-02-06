import React, { useState } from "react";
import logo from "../assets/images/logo-white.png";
import { CiLogin } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import SearchBox from "./SearchBox";
import { RouteSignIn,RouteSignUp,RouteIndex,RouteProfile } from "@/helpers/RouteName.js";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import usericon from '@/assets/images/user.png'
import { FaUser } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { removeUser } from "@/redux/user/user.slice";
import { showToast } from "@/helpers/showToast";
import { getEnv } from "@/helpers/getEnv";
import { FaSearch } from "react-icons/fa";
const Topbar = () => {
  const [ShowSearch,setShowSearch] = useState(false)
  const user = useSelector((state) => state.user);
   const dispatch = useDispatch()
   const navigate = useNavigate()
  const handleLogout = async () => {
      try {
       
                 const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/auth/logout`,{
                   method: 'get',
                    credentials: 'include',
                  
                 })
                 const data = await response.json();
                 if(!response.ok){
                   return  showToast('error', data.message)
                 }
                 dispatch(removeUser())
                  
                 navigate(RouteIndex)
                showToast('success', data.message) 
               } catch (error) {
                 showToast('error', error.message)
               }
  }

  const toggleSearch = () => {
         setShowSearch(!showToast)
  }
  return (
    <div
      className="flex justify-between items-center h-16 fixed w-full z-20 bg-white
    px-5 border-b"
    >
      <div>
        <img src={logo} className="w-44 md:w-auto" />
      </div>
      <div className="w-[500px]">
        <div  className={`md:relative  md:block absolute  bg-white left-0 w-full  md:top-0 top-16 md:p-0 p-5 ${ShowSearch? 'block': 'hidden' }`}>

        <SearchBox />
        </div>
      
      </div>
      <div className="flex items-center gap-5">
        <button onClick={toggleSearch} type="button" className="md:hidden block">
        <FaSearch  size={25} />
        </button>
        {!user.isLoggedIn ? (
          <Button asChild className="rounded-full">
            <Link to={RouteSignIn}>
              <CiLogin />
              Sign In
            </Link>
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={user.user.avatar || usericon } />
                <AvatarFallback>CSK</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                <p>{user.user.name}</p>
                <p className="text-sm">{user.user.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to={RouteProfile}>
               < FaUser/> 
                Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="">
               < FaPlus/> 
              Create Blog
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem  onClick = {handleLogout} className="cursor-pointer">
              
               < IoLogOut color="red"/> 
               Logout
              
              </DropdownMenuItem>
              
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default Topbar;
