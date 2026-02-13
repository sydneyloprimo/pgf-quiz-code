'use client'

import { useCallback, useState } from 'react'

import { FAQItem } from './FAQItem'

import { cn } from '@/utils/cn'

const FAQ_ITEMS = [
  {
    question: 'What does "clinical validation" mean for PGF?',
    answer:
      'Controlled preclinical research conducted at Cornell University under standardized conditions. Our eight-week feeding evaluation assessed palatability, digestive tolerance, and physiological markers in adult dogs—generating objective data to inform formulation decisions. This is observational research, not an establishment therapeutic efficacy.',
  },
  {
    question: 'Which biomarkers are measured, and why?',
    answer:
      'CRP and IL-6 as indicators of inflammatory balance. Daily fecal scoring for digestive tolerance. Microbiome sequencing for microbial diversity. These markers reflect measurable physiological responses to diet.',
  },
  {
    question: 'How is stool quality assessed?',
    answer:
      'Using the Purina Fecal Scoring System, a standardized 1–7 scale used in veterinary research. A score of 2 indicates ideal consistency. Daily scoring allows us to track digestive tolerance and variability over time.',
  },
  {
    question: 'What does microbiome diversity indicate?',
    answer:
      'A diverse gut microbiome is associated with more efficient digestion, nutrient synthesis, and balanced immune signaling. Our formulations include fermentable fibers and polyphenols to promote microbial diversity and short-chain fatty acid production. We do not claim to treat or prevent disease.',
  },
  {
    question: 'Why measure inflammation in healthy dogs?',
    answer:
      'Low-grade systemic inflammation is common and often diet-influenced. Monitoring CRP and IL-6 allows us to observe whether formulation correlates with shifts in inflammatory balance. ',
  },
  {
    question: 'How does PGF differ from prescription diets?',
    answer:
      'Prescription diets manage diagnosed conditions and require veterinary authorization. PGF is formulated for adult maintenance in healthy dogs; we optimize for digestibility, gut stability, and nutrient adequacy, not to treat a specific disease.',
  },
  {
    question: 'How is batch-level consistency ensured?',
    answer:
      'Fresh ingredients vary. Every production batch is tested after preparation against AAFCO vitamin and mineral standards, confirming that finished meals meet nutrient targets regardless of seasonal or sourcing variation.',
  },
  {
    question: 'Who oversees formulation development?',
    answer:
      'Board-certified veterinary nutritionists (ECVCN-credentialed). Research protocols are conducted under IACUC approval at Cornell, ensuring compliance with animal welfare and research governance standards.',
  },
  {
    question: 'Will research findings be published?',
    answer:
      'Yes. We intend to share findings through appropriate channels as analysis is completed. Academic collaborators do not commercially endorse products, and we are committed to transparent reporting regardless of outcome.',
  },
]

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(-1)

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? -1 : index))
  }, [])

  return (
    <section
      className={cn(
        'w-full',
        'px-5 py-14',
        'lg:px-24 py-16 lg:py-[200px]',
        'md:px-24 md:pt-24 md:pb-36',
        'bg-neutral-300'
      )}
    >
      <div className="w-full">
        <h2
          className={cn(
            'font-display',
            'text-[2.5rem] leading-12',
            'font-normal',
            'text-quaternary-800',
            'mb-6'
          )}
        >
          Understanding the Formulation
        </h2>

        <div className="flex flex-col">
          {FAQ_ITEMS.map((faq, index) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
              toggleAriaLabel="Toggle FAQ answer"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export { FAQSection }
