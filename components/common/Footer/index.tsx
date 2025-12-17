import { FooterImage } from './FooterImage'
import { FooterJoinWaitlist } from './FooterJoinWaitlist'
import { FooterLinks } from './FooterLinks'

import { cn } from '@/utils/cn'

const Footer = () => {
  return (
    <footer className={cn('w-full', 'flex flex-col lg:flex-row', 'flex-wrap')}>
      <FooterJoinWaitlist />
      <FooterImage />
      <FooterLinks />
    </footer>
  )
}

export default Footer
