import React from 'react';
import { PropagateLoader } from "react-spinners";
import "./Loader.css";
import { primary_color } from "../../constants/constant";


export const Loader = ({ height = "60vh", size = 18}) => {
  return (
    <div className='loader-centered-spinner' style={{height}}>
    <PropagateLoader size={size} color={primary_color} loading={true} />
    </div>
  )
}
