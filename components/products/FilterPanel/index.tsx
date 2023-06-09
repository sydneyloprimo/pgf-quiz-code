import Image from 'next/image'
import { useTranslations } from 'next-intl'

import FilterIcon from 'public/icons/filter.svg'

const FilterPanel = () => {
  const t = useTranslations('Products.fitlerPanel')
  return (
    <div className="flex-initial mb-4 flex justify-between md:hidden">
      <p className="text-sm">{t('title')}</p>
      <button className="active:opacity-80">
        <Image src={FilterIcon} alt={t('buttonAlt')} />
      </button>
    </div>
  )
}

export default FilterPanel
