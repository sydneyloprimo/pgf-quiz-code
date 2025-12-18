import Image from 'next/image'
import { useTranslations } from 'next-intl'
import ChevronIcon from 'public/icons/chevron-left.svg'

export enum ListNextButtonTypes {
  next = 'Next',
  previous = 'Previous',
}

interface ListNextButtonProps {
  onClick: () => void
  type: ListNextButtonTypes
  disabled?: boolean
}

const ListNextButton = ({ onClick, type, disabled }: ListNextButtonProps) => {
  const t = useTranslations('Common.List')
  return (
    <button
      className="flex hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={disabled}
      data-qa={
        type === ListNextButtonTypes.next ? 'next-button' : 'previous-button'
      }
    >
      {type === ListNextButtonTypes.previous && (
        <Image src={ChevronIcon} className="m-auto mr-5" alt="" />
      )}
      <p>
        {type === ListNextButtonTypes.next
          ? t('nextButton')
          : t('previousButton')}
      </p>
      {type === ListNextButtonTypes.next && (
        <Image src={ChevronIcon} className="m-auto ml-5 rotate-180" alt="" />
      )}
    </button>
  )
}

export default ListNextButton
