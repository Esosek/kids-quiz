type TextInputProps = {
  id: string
  value?: string
  type?: string
  placeholder?: string
  error?: string
  onChange?: (value: string) => void
}

export default function TextInput(props: TextInputProps) {
  return (
    <div
      className={`w-full border-2 rounded-full my-1 relative focus-within:border-green-500 focus-within:ring-green-500 focus-within:ring-1 ${
        props.error ? 'mt-4 border-red-600' : 'border-green-700'
      }`}
    >
      {props.error && (
        <p className='absolute text-red-600 uppercase text-sm -top-5 left-5'>
          {props.error}
        </p>
      )}
      <input
        name={props.id}
        id={props.id}
        type={props.type ?? 'text'}
        placeholder={props.placeholder}
        value={props.value}
        onChange={
          props.onChange ? (e) => props.onChange!(e.target.value) : undefined
        }
        className={`text-2xl uppercase text-center w-full h-full py-3 rounded-full overflow-clip focus:outline-none placeholder:text-green-800/45 ${
          props.error ? 'text-red-600' : 'text-black'
        }`}
      />
    </div>
  )
}
