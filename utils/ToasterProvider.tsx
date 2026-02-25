'use client'

import { PropsWithChildren } from 'react'
import { Slide, ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

interface ToastProviderProps extends PropsWithChildren {}

export default function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <ToastContainer
        transition={Slide}
        hideProgressBar
        limit={1}
        autoClose={2000}
      />
    </>
  )
}
