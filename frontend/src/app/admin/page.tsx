'use client'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useRef, useState } from 'react'

import Header from '@/components/Header'
import { Category, useCategoryStore } from '@/stores/category_store'
import { useInitializeData } from '@/hooks/useInitializeData'
import LoadSpinner from '@/components/common/LoadSpinner'
import Dropdown from '@/components/common/Dropdown'
import PrimaryButton from '@/components/common/PrimaryButton'
import QuestionInput from '@/components/admin/QuestionInput'
import { useUserStore } from '@/stores/user_store'
import LinkButton from '@/components/common/LinkButton'
import { fetchRequest } from '@/utils/fetch_request'
import { Subcategory } from '@/types/subcategory'

export default function AdminPage() {
  const router = useRouter()
  const [userData, hasDataLoaded] = useInitializeData()

  const formRef = useRef<HTMLFormElement>(null)
  const categoryInputRef = useRef<HTMLInputElement>(null)
  const subcategoryLabelRef = useRef<HTMLInputElement>(null)
  const subcategoryPriceRef = useRef<HTMLInputElement>(null)
  const subcategoryImageRef = useRef<HTMLInputElement>(null)

  const user = useUserStore((state) => state.user)
  const { initialize, categories, subcategories, addCategory, addSubcategory } = useCategoryStore()

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>()
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | undefined>()
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)
  const [isCreatingSubcategory, setIsCreatingSubcategory] = useState(false)
  const [formMessage, setFormMessage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (hasDataLoaded && !userData?.user.isAdmin) {
      router.push('/')
    } else {
      initialize({ categories: userData?.categories, subcategories: userData?.subcategories })
    }
  }, [router, hasDataLoaded, userData, initialize])

  const handleCategorySelect = (catId: string) => setSelectedCategory(catId)
  const handleSubcategorySelect = (subId: string) => setSelectedSubcategory(subId)

  async function handleCategorySubmit() {
    const input = categoryInputRef.current?.value
    if (!input || !input.trim().length) {
      setFormMessage('Prosím vyplň název kategorie')
      return
    }
    try {
      setIsProcessing(true)
      const res = await fetchRequest<Category>('/categories', 'POST', { label: input }, user?.token)
      if (res.ok) {
        const category = res.body!
        addCategory(category)
        setIsCreatingCategory(false)
        setSelectedCategory(category.id)
      } else {
        throw new Error('Server responded with status: ' + res.status + ' ' + res.error)
      }
    } catch (error) {
      if (error instanceof Error) {
        setFormMessage(error.message)
      }
    }
    setIsProcessing(false)
  }

  async function handleSubcategorySubmit() {
    try {
      if (!isSubcategoryFormValid()) {
        return
      }
      setIsProcessing(true)
      const formData = new FormData()
      formData.append('label', subcategoryLabelRef.current!.value)
      formData.append('unlockPrice', subcategoryPriceRef.current!.value)
      formData.append('categoryId', selectedCategory!)
      formData.append('image', subcategoryImageRef.current!.files![0])

      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/subcategories', {
        method: 'POST',
        body: formData,
        headers: { Authorization: `Bearer ${user?.token}` },
      })
      if (res.ok) {
        let subcategory = await res.json()
        // Workaround inconsistent Subcategory format - Actual: categoryId: string / Expected: {id: string, label: string}
        subcategory = { ...subcategory, category: { id: subcategory.categoryId, label: '' } } as Subcategory
        addSubcategory(subcategory)
        setIsCreatingSubcategory(false)
        setSelectedSubcategory(subcategory.id)
      } else {
        throw new Error('Server responded with status: ' + res.status + ' ' + res.statusText)
      }
    } catch (error) {
      if (error instanceof Error) {
        setFormMessage(error.message)
      }
    }
    setIsProcessing(false)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    try {
      setIsProcessing(true)
      event.preventDefault()
      setFormMessage(null)
      const formData = new FormData(event.currentTarget)
      validateForm(formData)
      formData.append('subcategoryId', selectedSubcategory!)

      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/questions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        body: formData,
      })

      if (res.ok) {
        const body = await res.json()
        setFormMessage('Otázka byla úspěšně vytvořena pod ID ' + body.id)
        formRef.current?.reset()
      } else {
        throw new Error('Failed to submit form: ' + res.statusText)
      }
    } catch (error) {
      if (error instanceof Error) {
        const formattedErrorMessage = error.message[0].toUpperCase() + error.message.slice(1)
        setFormMessage(formattedErrorMessage)
      }
    }
    setIsProcessing(false)
  }

  function validateForm(formData: FormData) {
    const validationErrors: string[] = []

    if (!selectedSubcategory) {
      validationErrors.push('není vybraná subkategorie')
    }

    if (!formData.get('text')) {
      validationErrors.push('není vyplněná otázka')
    }

    if (!formData.get('answers')) {
      validationErrors.push('nejsou vyplněné odpovědi')
    } else {
      const answers = formData.get('answers') as string
      if (answers.split(', ').length < 5) {
        validationErrors.push('vyplň alespoň 5 odpovědí oddělené čárkou a mezerou')
      }
    }
    if (validationErrors.length) {
      throw new Error(validationErrors.join(', '))
    }
  }

  function isSubcategoryFormValid() {
    const errors: string[] = []
    const input = subcategoryLabelRef.current?.value
    if (!input || !input.trim().length) {
      errors.push('chybí název subkategorie')
    }
    if (!selectedCategory) {
      errors.push('není vybraná kategorie')
    }
    if (!subcategoryImageRef.current!.value) {
      errors.push('není nahrán obrázek')
    }

    if (errors.length > 0) {
      const errorsArr = errors.join(', ')
      setFormMessage(errorsArr[0].toUpperCase() + errorsArr.slice(1))
      return false
    }
    return true
  }

  return hasDataLoaded ? (
    <main className='flex flex-col items-center gap-8 pb-16'>
      <Header />
      <h1 className='uppercase text-2xl'>{isProcessing ? <LoadSpinner /> : 'nová otázka'}</h1>
      {formMessage && <p className='text-red-500'>{formMessage}</p>}
      <div className='w-full space-y-4'>
        <div className='relative'>
          <Dropdown
            options={Object.entries(categories!).map(([id, cat]) => [id, cat.label]) as [string, string][]}
            value={selectedCategory}
            onChange={handleCategorySelect}
            placeholder='kategorie'
            isFullWidth
          />
          <button
            onClick={() => {
              setIsCreatingCategory((state) => !state)
            }}
            className='absolute -left-5 -top-4 rounded-full text-2xl bg-pink-300 size-8 flex items-center justify-center'
          >
            {isCreatingCategory ? '-' : '+'}
          </button>
          {isCreatingCategory && (
            <div className='flex gap-4 w-11/12 ml-auto'>
              <input
                ref={categoryInputRef}
                type='text'
                placeholder='NÁZEV KATEGORIE / př. Geografie'
                className='block w-full bg-lime-100 rounded-2xl py-3 px-4 my-2'
              />
              <LinkButton onClick={handleCategorySubmit}>VYTVOŘIT</LinkButton>
            </div>
          )}
        </div>
        {selectedCategory && (
          <div className='relative'>
            <Dropdown
              options={
                Object.values(subcategories!)
                  .filter((sub) => sub!.category.id === selectedCategory)
                  .map((sub) => [sub.id, sub.label]) as [string, string][]
              }
              value={selectedSubcategory}
              onChange={handleSubcategorySelect}
              placeholder='subkategorie'
              isFullWidth
            />
            <button
              onClick={() => setIsCreatingSubcategory((state) => !state)}
              className='absolute -left-5 -top-4 rounded-full text-2xl bg-pink-300 size-8 flex items-center justify-center'
            >
              {isCreatingSubcategory ? '-' : '+'}
            </button>
            {isCreatingSubcategory && (
              <div className='flex flex-col gap-2 w-11/12 ml-auto py-2'>
                <input
                  ref={subcategoryLabelRef}
                  type='text'
                  placeholder='NÁZEV SUBKATEGORIE / př. Státní vlajky 1'
                  className='block w-full bg-lime-100 rounded-2xl py-3 px-4'
                />
                <input
                  ref={subcategoryPriceRef}
                  type='number'
                  placeholder='CENA - 0'
                  min={0}
                  className='block w-full bg-lime-100 rounded-2xl py-3 px-4'
                />
                <input
                  ref={subcategoryImageRef}
                  type='file'
                  name='subcategory_image'
                  id='img-input'
                  className='bg-lime-100 py-3 px-4 rounded-2xl'
                />
                <LinkButton onClick={handleSubcategorySubmit}>VYTVOŘIT</LinkButton>
              </div>
            )}
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} ref={formRef} className='flex flex-col gap-6 items-center  w-full'>
        {selectedSubcategory && <QuestionInput />}
        <PrimaryButton type='submit' disabled={isProcessing}>
          VYTVOŘIT OTÁZKU
        </PrimaryButton>
      </form>
    </main>
  ) : (
    <div className='grid justify-items-center gap-4'>
      Nahrávám uživatelská data...
      <LoadSpinner />
    </div>
  )
}
