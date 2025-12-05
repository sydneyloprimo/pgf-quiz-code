import React from 'react'

export const formatShippingText = (text: string): React.ReactNode => {
  // Pattern to match: number + "meals" or "comidas" (e.g., "seven meals", "catorce comidas")
  const mealsPattern =
    /(\d+\s+(?:meals|comidas)|(?:seven|fourteen|catorce)\s+(?:meals|comidas))/i

  // Pattern to match: "delivered every week" or "entregadas cada semana"
  const weekPattern = /(delivered\s+every\s+week|entregadas\s+cada\s+semana)/i

  // Pattern to match: "delivered every two weeks" or "entregadas cada dos semanas"
  const twoWeeksPattern =
    /(delivered\s+every\s+two\s+weeks|entregadas\s+cada\s+dos\s+semanas)/i

  const parts: React.ReactNode[] = []
  let lastIndex = 0

  // Find all matches and their positions
  const matches: Array<{
    start: number
    end: number
    text: string
  }> = []

  // Find meals pattern
  const mealsMatch = text.match(mealsPattern)
  if (mealsMatch && mealsMatch.index !== undefined) {
    matches.push({
      start: mealsMatch.index,
      end: mealsMatch.index + mealsMatch[0].length,
      text: mealsMatch[0],
    })
  }

  // Find two weeks pattern first (longer, more specific)
  const twoWeeksMatch = text.match(twoWeeksPattern)
  if (twoWeeksMatch && twoWeeksMatch.index !== undefined) {
    matches.push({
      start: twoWeeksMatch.index,
      end: twoWeeksMatch.index + twoWeeksMatch[0].length,
      text: twoWeeksMatch[0],
    })
  } else {
    // Only check for week pattern if two weeks wasn't found
    const weekMatch = text.match(weekPattern)
    if (weekMatch && weekMatch.index !== undefined) {
      matches.push({
        start: weekMatch.index,
        end: weekMatch.index + weekMatch[0].length,
        text: weekMatch[0],
      })
    }
  }

  // Sort matches by position
  matches.sort((a, b) => a.start - b.start)

  // Build the result with bold parts
  matches.forEach((match) => {
    // Add text before the match
    if (match.start > lastIndex) {
      parts.push(text.substring(lastIndex, match.start))
    }
    // Add the bold match
    parts.push(
      <strong key={match.start} className="font-semibold">
        {match.text}
      </strong>
    )
    lastIndex = match.end
  })

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }

  return parts.length > 0 ? <>{parts}</> : text
}
