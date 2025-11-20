import {
  Root,
  Trigger,
  DropdownMenuContentProps,
  Portal,
  Content,
  Item,
  Separator,
} from '@radix-ui/react-dropdown-menu'
import cn from 'classnames'
import React from 'react'

export const DropdownMenu = Root
export const DropdownMenuTrigger = Trigger

export const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(({ children, ...props }: DropdownMenuContentProps, forwardedRef) => {
  return (
    <Portal>
      <Content ref={forwardedRef} {...props}>
        {children}
      </Content>
    </Portal>
  )
})
DropdownMenuContent.displayName = 'DropdownMenuContent'

export const DropdownItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Item>
>(({ children, className, ...props }, forwardedRef) => {
  return (
    <Item
      ref={forwardedRef}
      className={cn(
        'h-[40px] w-full text-white bg-neutral-950 px-4 focus:outline-offset-[-3px] hover:outline-offset-[-3px] active:outline-offset-[-3px] disabled:outline-offset-[-3px] flex items-center focus:outline-dashed focus:outline-2 focus:outline-primary-600 hover:bg-primary-700 hover:outline-none disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-700 disabled:outline-none active:bg-primary-600 active:outline-primary-400 active:outline',
        className
      )}
      {...props}
    >
      {children}
    </Item>
  )
})
DropdownItem.displayName = 'DropdownItem'

export const DropdownMenuSeparator = ({ className }: { className: string }) => {
  return <Separator className={className} />
}
