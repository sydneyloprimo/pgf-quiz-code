'use client'
import cn from 'classnames'
import { useKeenSlider } from 'keen-slider/react'
import { useEffect, useState } from 'react'
import { useWindowSize } from 'usehooks-ts'

import CategoryCard from '@/components/common/CategoryCard'
import { MOBILE_WIDTH } from '@/constants'
import 'keen-slider/keen-slider.min.css'

interface CarouselProps {
  items: { name: string }[]
}

const MAX_VISIBLE_ITEMS = {
  desktop: 4,
  mobile: 2,
}

const ArrowBox = (position: string, onClick: () => void) => (
  <div className="flex-col justify-center hidden md:flex">
    <div
      role="button"
      onClick={onClick}
      className="p-3 leading-4 border border-dark-violet rounded text-dark-violet bg-white"
    >
      {position === 'left' ? <>&#8592;</> : <>&#8594;</>}
    </div>
  </div>
)

const Carousel = ({ items }: CarouselProps) => {
  const { width: windowWidth } = useWindowSize()
  const [isMobile, setIsMobile] = useState(windowWidth <= MOBILE_WIDTH)

  const visibleSlides = isMobile
    ? MAX_VISIBLE_ITEMS.mobile
    : MAX_VISIBLE_ITEMS.desktop

  const [pagination, setPagination] = useState({
    page: 1,
    pageCount: Math.ceil(items.length / visibleSlides),
  })

  const [sliderRef, instanceRef] = useKeenSlider({
    drag: isMobile,
    slideChanged(slider) {
      if (isMobile) {
        const {
          track: {
            details: { abs },
          },
        } = slider

        setPagination((prev) => ({
          ...prev,
          page: Math.floor(abs / visibleSlides) + 1,
        }))
      }
    },
    slides: {
      number: items.length,
      perView: visibleSlides,
    },
  })

  useEffect(() => {
    if (!isMobile) {
      const diff =
        pagination.page -
        ((instanceRef.current?.track?.details?.position || 0) + 1)

      instanceRef.current?.animator.start([
        { distance: diff, duration: 400, easing: (value: number) => value },
      ])
    }
  }, [pagination, isMobile, visibleSlides])

  useEffect(() => {
    if (!isMobile && windowWidth < MOBILE_WIDTH) {
      setIsMobile(true)
      setPagination((prev) => ({
        ...prev,
        pageCount: Math.ceil(items.length / MAX_VISIBLE_ITEMS.mobile),
      }))
    } else if (isMobile && windowWidth >= MOBILE_WIDTH) {
      setIsMobile(false)

      const pageCount = Math.ceil(items.length / MAX_VISIBLE_ITEMS.desktop)
      setPagination((prev) => ({
        page: prev.page <= pageCount ? prev.page : 1,
        pageCount,
      }))
    }
  }, [windowWidth])

  const nextPage = () => {
    if (pagination.page < pagination.pageCount) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
    }
  }

  const prevPage = () => {
    if (pagination.page > 1) {
      setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
    }
  }

  return (
    <div className="my-9 w-full items-center flex flex-col">
      <div className="flex flex-row w-full gap-4 justify-between">
        {ArrowBox('left', prevPage)}
        <div ref={sliderRef} className="keen-slider flex-1">
          {items.map(({ name }, i) => (
            <CategoryCard
              key={`${name}-${i}`}
              name={name}
              className="keen-slider__slide"
            />
          ))}
        </div>
        {ArrowBox('right', nextPage)}
      </div>
      {items.length > visibleSlides && (
        <div className="flex flex-row justify-between gap-2 md:gap-4 mt-8">
          {[...Array(pagination.pageCount)].map((_e, i) => (
            <div
              key={i}
              className={cn(
                'rounded-full w-2 md:w-4 h-2 md:h-4 text-transparent',
                {
                  'bg-dark-grey': i + 1 === pagination.page,
                  'bg-grey': i + 1 !== pagination.page,
                }
              )}
            >
              {i}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Carousel
