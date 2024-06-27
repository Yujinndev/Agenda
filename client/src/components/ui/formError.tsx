import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { usePresence, motion, AnimatePresence } from 'framer-motion'
import { FormMessage } from '@/components/ui/form'

export function Message({ msg }: { msg: string }) {
  const ref = useRef(null)
  const [isPresent, safeToRemove] = usePresence()

  useEffect(() => {
    if (!isPresent) {
      gsap.to(ref.current, {
        opacity: 0,
        onComplete: () => safeToRemove?.(),
      })
    }
  }, [isPresent, safeToRemove])

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0.4, minHeight: 20, maxHeight: 0 },
        visible: { opacity: 1, maxHeight: 100 },
      }}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="block transform overflow-hidden pr-12 duration-300"
    >
      <FormMessage>{msg}</FormMessage>
    </motion.div>
  )
}

export default function FormError(errorField: any) {
  return (
    <AnimatePresence>
      {errorField ? <Message msg={errorField?.message} /> : null}
    </AnimatePresence>
  )
}
