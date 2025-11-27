interface ProgressBarProps {
  visitedSteps: number
}

const ProgressBar = ({ visitedSteps }: ProgressBarProps) => {
  const percentage = Math.min((visitedSteps / 8) * 100, 100)

  return (
    <div className="w-full">
      <div className="bg-neutral-600 h-1 w-full rounded-full overflow-hidden">
        <div
          className="bg-primary-700 h-full transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export { ProgressBar }
