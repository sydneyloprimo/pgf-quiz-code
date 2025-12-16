import { useTranslations } from 'next-intl'

import { Button } from '@/components/common/Button'
import { EnvelopeIcon } from '@/components/common/Icon'
import { Modal } from '@/components/common/Modal'
import { Routes } from '@/types/enums/routes'

interface WaitlistSuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

const WaitlistSuccessModal = ({
  isOpen,
  onClose,
}: WaitlistSuccessModalProps) => {
  const t = useTranslations('Quiz.waitlistModal')

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeButtonLabel={t('closeButtonLabel')}
      ariaLabel={t('successAriaLabel')}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex flex-col gap-4">
          <h2 className="font-body text-xl font-bold text-secondary-950">
            {t('successHeading')}
          </h2>
          <p className="font-body text-base text-neutral-900">
            {t('successDescription')}
          </p>
        </div>
        <div className="relative shrink-0 w-auto mx-auto">
          <EnvelopeIcon
            className="w-full h-auto"
            aria-label={t('successImageAlt')}
          />
        </div>
        <Button
          type="button"
          variant="primary"
          href={Routes.home}
          className="min-w-48"
        >
          {t('successButton')}
        </Button>
      </div>
    </Modal>
  )
}

export { WaitlistSuccessModal }
