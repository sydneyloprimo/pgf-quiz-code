'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { isEmailValid, isPasswordValid } from '@/utils/utils'

export default function SignUp() {
  const t = useTranslations('SignUp')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [, setEmailError] = useState('')
  const [, setPasswordError] = useState('')

  function isValid() {
    setEmailError(!isEmailValid(email) ? 'Your email is invalid' : '')

    setPasswordError(
      !isPasswordValid(password) ? 'Your password is invalid.' : ''
    )

    return !!isEmailValid(email) && !!isPasswordValid(password)
  }

  const handleSubmit = () => {
    if (isValid()) {
      //TODO api call and redirect to signin
    }
  }

  return (
    <div className="w-[360px] h-[556px] bg-white text-black mx-4 mt-9 md:mt-28 md:mx-32 px-8 py-10 rounded-lg">
      <div className="flex justify-center mb-10">
        <Image
          src="/icons/logo-black.svg"
          alt="Logo black"
          width={173}
          height={30}
        />
      </div>
      <form>
        <div className="flex flex-col mb-3">
          <label htmlFor="email">{t('email')}</label>
          <input
            className="h-[44px] rounded-lg border border-solid border-black p-3"
            placeholder="Type your email"
            type="text"
            id="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="password">{t('password')}</label>
          <input
            className="h-[44px] rounded-lg border border-solid border-black p-3"
            placeholder="Type your password"
            type="text"
            id="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn-primary w-full mt-3 mb-5" onClick={handleSubmit}>
          Sign up
        </button>
      </form>
      <div className="flex justify-center gap-1">
        <span>{t('loginRedirectMessage')}</span>
        <Link className="text-links" href="/">
          {t('loginRedirectLink')}
        </Link>
      </div>
    </div>
  )
}
