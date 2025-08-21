type DropdownProps = {
  options: [string, string][]
  value: string | undefined
  onChange: (filter: string) => void
  placeholder?: string
  isFullWidth?: boolean
}

export default function Dropdown(props: DropdownProps) {
  const handleSelect = (value: string) => props.onChange(value)
  return (
    <select
      onChange={(e) => handleSelect(e.target.value)}
      value={props.value}
      className={`block rounded-2xl w-full py-4 px-5 bg-lime-100 ${props.isFullWidth ? '' : 'sm:w-auto'}`}
    >
      {props.placeholder && <option hidden>{props.placeholder.toUpperCase()}</option>}
      {props.options.map(([key, value]) => (
        <option key={key} value={key}>
          {value.toUpperCase()}
        </option>
      ))}
    </select>
  )
}
