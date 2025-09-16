export default function QuestionInput() {
  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='relative'>
        <input
          type='text'
          name='text'
          id='question-input'
          placeholder='OTÁZKA'
          className='block w-full bg-lime-100 rounded-2xl py-3 px-4'
        />
        <span className='absolute left-2 top-1 text-red-500 text-xl'>*</span>
      </div>
      <div className='relative'>
        <input
          type='text'
          name='answers'
          id='answers-input'
          placeholder='ODPOVĚDI'
          className='block w-full bg-lime-100 rounded-2xl py-3 px-4'
        />
        <label htmlFor='answers-input' className='text-sm'>
          První odpověď je považována za správnou. Přidej alespoň 5 odpovědí. Odděl čárkou a mezerou. Příklad:
          <span className='italic'>Jupiter, Uran, Saturn</span>
          <span className='absolute left-2 top-1 text-red-500 text-xl'>*</span>
        </label>
      </div>
      <label htmlFor='img-input' className='mt-8 text-sm text-center'>
        <span className='text-base'>OBRÁZEK</span> nahraj ve velikosti 600x400 px ve formátu PNG
      </label>
      <input type='file' name='question_image' id='img-input' className='bg-lime-100 py-3 px-4 rounded-2xl' />
    </div>
  )
}
