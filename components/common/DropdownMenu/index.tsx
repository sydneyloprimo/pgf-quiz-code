import {
  Root,
  Trigger,
  DropdownMenuContentProps,
  Portal,
  Content,
  Item,
  Separator,
} from '@radix-ui/react-dropdown-menu'
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
>(({ children, ...props }, forwardedRef) => {
  return (
    <Item ref={forwardedRef} {...props}>
      {children}
    </Item>
  )
})
DropdownItem.displayName = 'DropdownItem'

export const DropdownMenuSeparator = ({ className }: { className: string }) => {
  return <Separator className={className} />
}
