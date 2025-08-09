type SubcatgoryTrackerProps = {
  answeredCount: number
  questionCount: number
}

export default function SubcategoryTracker({
  answeredCount,
  questionCount,
}: SubcatgoryTrackerProps) {
  return (
    <div className='bg-red-800 rounded-2xl text-white font-medium py-[1px]'>
      {answeredCount} / {questionCount}
    </div>
  )
}
