type SubcategoryFilterProps = {
  options: string[]
  onChange: (filter: string) => void
}

export default function SubcategoryFilter(props: SubcategoryFilterProps) {
  const handleSelect = (value: string) => props.onChange(value)

  return (
    <select
      onChange={(e) => handleSelect(e.target.value)}
      className='block mb-4 rounded-2xl w-full py-4 px-5 bg-lime-100 sm:w-auto'
    >
      {props.options.map((option) => (
        <option key={option}>{option.toUpperCase()}</option>
      ))}
    </select>
  )
}
