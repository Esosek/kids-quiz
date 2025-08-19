'use client'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'

import Header from '@/components/Header'
import { useCategoryStore } from '@/stores/category_store'
import { useInitializeData } from '@/hooks/useInitializeData'
import LoadSpinner from '@/components/common/LoadSpinner'
import Dropdown from '@/components/common/Dropdown'
import PrimaryButton from '@/components/common/PrimaryButton'
import QuestionInput from '@/components/admin/QuestionInput'
import { useUserStore } from '@/stores/user_store'

export default function AdminPage() {
  const router = useRouter()
  const userData = useInitializeData()
  const user = useUserStore((state) => state.user)

  const { initialize, categories, subcategories } = useCategoryStore()

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>()
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | undefined>()
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)
  const [isCreatingSubcategory, setIsCreatingSubcategory] = useState(false)
  const [hasDataLoaded, setHasDataLoaded] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (userData !== undefined) {
      setHasDataLoaded(true)
    }
  }, [userData])

  useEffect(() => {
    if (hasDataLoaded && userData?.user.id !== process.env.NEXT_PUBLIC_ADMIN_ID) {
      router.push('/')
    } else {
      initialize({ categories: userData?.categories, subcategories: userData?.subcategories })
    }
  }, [router, hasDataLoaded, userData, initialize])

  const handleCategorySelect = (catId: string) => setSelectedCategory(catId)
  const handleSubcategorySelect = (subId: string) => setSelectedSubcategory(subId)

  async function handleCategorySubmit() {
    // TODO: Implement creating category from admin
  }

  async function handleSubcategorySubmit() {
    // TODO: Implement creating subcategory from admin
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault()
      setFormError(null)
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
        console.log(body)
        // TODO: Sync created question with local category store
      } else {
        throw new Error('Failed to submit form: ' + res.statusText)
      }
    } catch (error) {
      if (error instanceof Error) {
        const formattedErrorMessage = error.message[0].toUpperCase() + error.message.slice(1)
        setFormError(formattedErrorMessage)
      }
    }
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

  return hasDataLoaded ? (
    <main className='flex flex-col items-center gap-8'>
      <Header />
      <h1 className='uppercase text-2xl'>nová otázka</h1>
      {formError && <p className='text-red-500'>{formError}</p>}
      <form onSubmit={handleSubmit} className='flex flex-col gap-6 items-center  w-full'>
        <Dropdown
          options={Object.entries(categories!).map(([id, cat]) => [id, cat.label]) as [string, string][]}
          onChange={handleCategorySelect}
          placeholder='kategorie'
          isFullWidth
        />
        {selectedCategory && (
          <Dropdown
            options={
              Object.values(subcategories!)
                .filter((sub) => sub!.category.id === selectedCategory)
                .map((sub) => [sub.id, sub.label]) as [string, string][]
            }
            onChange={handleSubcategorySelect}
            placeholder='subkategorie'
            isFullWidth
          />
        )}
        {selectedSubcategory && <QuestionInput />}
        <PrimaryButton type='submit'>VYTVOŘIT</PrimaryButton>
      </form>
    </main>
  ) : (
    <div className='grid justify-items-center gap-4'>
      Nahrávám uživatelská data...
      <LoadSpinner />
    </div>
  )
}
