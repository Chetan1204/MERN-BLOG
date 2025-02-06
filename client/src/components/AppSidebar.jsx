import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/ui/sidebar"
import { Link } from 'react-router-dom'
   import logo from '../assets/images/logo-white.png'
   import { IoIosHome } from "react-icons/io";
   import { BiSolidCategory } from "react-icons/bi";
   import { FaBloggerB } from "react-icons/fa";
   import { FaCommentAlt } from "react-icons/fa";
   import { FaUserAlt } from "react-icons/fa";
   import { GoDotFill } from "react-icons/go";
import { RouteBlog, RouteBlogByCategory, RouteCategoryDetails, RouteCommentDetails, RouteIndex, RouteUser } from '@/helpers/RouteName.js';
import { useFetch } from '@/hooks/useFetch';
import { getEnv } from '@/helpers/getEnv';
import { useSelector } from 'react-redux';
const AppSidebar = () => {
  const user = useSelector(state => state.user)
  const {data: categoryData} = useFetch(`${getEnv('VITE_API_BASE_URL')}/category/all-category`,{
      method: 'get',
      credentials: 'include'
    })
  return (
    <Sidebar>
      <SidebarHeader className="bg-white">
        <img src={logo} width={120} />
      </SidebarHeader>
      <SidebarContent className="bg-white">
      <SidebarGroup>
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton>
                <IoIosHome />
                   <Link to= {RouteIndex}> Home</Link> 
                </SidebarMenuButton>
            </SidebarMenuItem>


             {user && user.isLoggedIn
             
             ?<>
             <SidebarMenuItem>
             <SidebarMenuButton>
             <FaBloggerB />
                <Link to={RouteBlog} > Blogs</Link> 
             </SidebarMenuButton>
         </SidebarMenuItem>
         <SidebarMenuItem>
             <SidebarMenuButton>
             <FaCommentAlt />
                <Link to= {RouteCommentDetails}> Comments</Link> 
             </SidebarMenuButton>
         </SidebarMenuItem>
         </>
             :
             
             <></>
             
             }
             

             {user && user.isLoggedIn && user.user.role === 'admin'
             
             ?<>
            
            <SidebarMenuItem>
                <SidebarMenuButton>
                <BiSolidCategory />
                   <Link to= {RouteCategoryDetails}> Categories</Link> 
                </SidebarMenuButton>
            </SidebarMenuItem>
          
            <SidebarMenuItem>
                <SidebarMenuButton>
                <FaUserAlt />
                   <Link to= {RouteUser}> Users</Link> 
                </SidebarMenuButton>
            </SidebarMenuItem>
         </>
             :
             
             <></>
             
             }


        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>
            Categories
        </SidebarGroupLabel>
        <SidebarMenu>
          {categoryData && categoryData.category.length> 0
          && categoryData.category.map(category=> <SidebarMenuItem
          key={category._id}>
            <SidebarMenuButton>
            <GoDotFill />

               <Link to= {RouteBlogByCategory(category.slug)}>{category.name}</Link> 
            </SidebarMenuButton>
        </SidebarMenuItem>)
          
          }
           
           </SidebarMenu>
      </SidebarGroup>
     </SidebarContent>
      
    </Sidebar>
  )
}


export default AppSidebar