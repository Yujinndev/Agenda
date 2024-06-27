import React, { useState, forwardRef } from 'react'
import { Input } from './input'
import { Eye, EyeOff } from 'lucide-react'

const PasswordInput = forwardRef(({ ...props }, ref) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative">
      <Input
        ref={ref as React.RefObject<HTMLInputElement>}
        placeholder={isVisible ? '' : '********'}
        type={isVisible ? 'text' : 'password'}
        name="password"
        {...props}
      />
      <button
        type="button"
        onClick={() => setIsVisible((prev) => !prev)}
        className="absolute inset-y-0 right-4"
      >
        {isVisible ? <Eye size={20} /> : <EyeOff size={20} />}
      </button>
    </div>
  )
})

export default PasswordInput
