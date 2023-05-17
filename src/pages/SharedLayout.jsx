import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/Navbar'

export const SharedLayout = () => {
  return (
    <div>
        <Navbar/>

        <div>
            <Outlet/>
        </div>
    </div>
  )
}
