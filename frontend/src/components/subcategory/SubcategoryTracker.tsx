type SubcatgoryTrackerProps = {
  answeredCount: number
  questionCount: number
}

export default function SubcategoryTracker({
  answeredCount,
  questionCount,
}: SubcatgoryTrackerProps) {
  const answeredRatio = (answeredCount / questionCount) * 100
  return (
    <div className='w-full relative h-7 border-2 border-red-800 bg-red-800/15 rounded-2xl overflow-clip '>
      <div
        style={{ width: `${answeredRatio}%` }}
        className='bg-red-800 h-full'
      ></div>
      <div className='absolute bottom-0 top-0 left-0 right-0 text-white font-medium'>
        {answeredCount} / {questionCount}
      </div>
    </div>
  )
}
