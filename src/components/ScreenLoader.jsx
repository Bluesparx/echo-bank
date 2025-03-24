import React from 'react'
import { ThreeCircles } from "react-loader-spinner"
import './ScreenLoader.css'

export default function ScreenLoader() {
    return (
        <div className='screen-loader'>
            <ThreeCircles
                color="white"
                height={120}
                width={120}
                ariaLabel="three-circles-rotating"
            />
        </div>
    )
} 