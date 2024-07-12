import {
  useState,
  useRef,
  useEffect,
  ComponentType,
  MutableRefObject,
} from 'react'

interface WithClickOutsideProps {
  open: boolean
  setOpen: (open: boolean) => void
  innerRef: MutableRefObject<HTMLDivElement | null>
}

export default function withClickOutside<T>(
  WrappedComponent: ComponentType<T & WithClickOutsideProps>
) {
  const Component = (props: T) => {
    const [open, setOpen] = useState(false)

    const ref = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          setOpen(false)
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [ref])

    return (
      <WrappedComponent
        {...props}
        open={open}
        setOpen={setOpen}
        innerRef={ref}
      />
    )
  }

  return Component
}
