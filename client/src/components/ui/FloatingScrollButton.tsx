import { useState, useEffect, ReactNode } from 'react'
import { ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const FloatingScrollButton = ({
  to,
  icon,
}: {
  to: string
  icon?: ReactNode
}) => {
  const [isVisible, setIsVisible] = useState(false)

  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    setIsVisible(scrollTop > 200)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    isVisible && (
      <Button
        variant="secondary"
        className="fixed right-4 bottom-4 w-16 h-16 rounded-full items-center justify-center"
        asChild
      >
        <Link to={to}>{icon || <ArrowUp size={40} />}</Link>
      </Button>
    )
  )
}

export default FloatingScrollButton
