import { ReactNode, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface Tab {
  title: string
  value: string
  content: ReactNode
}

type Props = {
  tabs: Tab[]
  activeTabClassName: string
  disabled?: boolean
}

export const Tabs = ({
  tabs: propTabs,
  activeTabClassName,
  disabled,
}: Props) => {
  const [active, setActive] = useState<Tab>(propTabs[0])

  const moveSelectedTabToTop = (idx: number) => {
    setActive(propTabs[idx])
  }

  return (
    <div className="relative -mt-5 overflow-hidden">
      <div
        className={
          'no-scrollbar relative flex w-full max-w-full flex-row items-center justify-start gap-2 overflow-x-auto'
        }
      >
        {propTabs.map((tab, idx) => (
          <Button
            key={tab.title}
            variant="link"
            onClick={() => {
              moveSelectedTabToTop(idx)
            }}
            disabled={disabled}
            className="relative rounded-full px-4"
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            <span
              className={cn('relative block text-black dark:text-white', {
                'text-primary': active.value === tab.value,
              })}
            >
              {tab.title}
            </span>
            {active.value === tab.value && (
              <motion.div
                layoutId="clickedbutton"
                transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
                className={cn(
                  'absolute inset-x-0 -bottom-[3px] z-50 h-[6px] rounded-full dark:bg-zinc-800',
                  activeTabClassName
                )}
              />
            )}
          </Button>
        ))}
      </div>
      <div className="h-[1px] w-full rounded-full bg-gray-400" />

      <div className="relative my-6 w-full">{active.content}</div>
    </div>
  )
}
