import { getEnv } from '@/helpers/getEnv'
import { useFetch } from '@/hooks/useFetch'
import React from 'react'
import { FaComments } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
const CommentCount = ({props}) => {
    const {data, loading, error} = useFetch(`${getEnv('VITE_API_BASE_URL')}/comment/get-count/${props.blogid}`,{
            method : 'get',
            Credential: 'include',
        })
console.log("ccccc",data);


  return (
      <button type='button' className='flex justify-between items-center gap-1'>
        <FaComments />
        {data?.commentcount}

      </button>
  )
}

export default CommentCount