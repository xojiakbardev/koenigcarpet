"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { X, Plus, Edit2, Save, Loader2, Globe, Package, Ruler, Palette, Star, FileText } from "lucide-react"
import { useDictionary } from "@/hooks/useDictionary"
import { useLocale } from "@/hooks/useLocale"
import { useDebounce } from "@/hooks/useDebounce"

type LanguageCode = "en" | "ru" | "tr"
type MultiLanguageText = Record<LanguageCode, string>
type MultiLanguageWithValue = MultiLanguageText & { value: string }

type Features = {
  head: string
  care_and_warranty: string[]
  technical_info: string[]
}

type MultiLanguageFeatures = Record<LanguageCode, Features>

type FeatureType = "care_and_warranty" | "technical_info"

type FormData = {
  id: number
  product_name: MultiLanguageText
  description: MultiLanguageText
  features: MultiLanguageFeatures
  color: MultiLanguageWithValue
  collection: MultiLanguageWithValue
  style: MultiLanguageWithValue
  product_code: string
  price: number
  images: string[]
  sizes: string[]
  isNew: boolean
  isRunners: boolean
  inStock: boolean
}

type ValidationErrors = Record<string, string>

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
] as const

export default function AddProductPage() {
  const { dictionary } = useDictionary()
  const [locale] = useLocale()

  const [form, setForm] = useState<FormData>({
    id: Date.now(),
    product_name: { en: "", ru: "", tr: "" },
    description: { en: "", ru: "", tr: "" },
    features: {
      en: { head: "", care_and_warranty: [], technical_info: [] },
      ru: { head: "", care_and_warranty: [], technical_info: [] },
      tr: { head: "", care_and_warranty: [], technical_info: [] },
    },
    color: { en: "", ru: "", tr: "", value: "" },
    collection: { en: "", ru: "", tr: "", value: "" },
    style: { en: "", ru: "", tr: "", value: "" },
    product_code: "",
    price: 0,
    images: [],
    sizes: [],
    isNew: false,
    isRunners: false,
    inStock: true,
  })

  const [editingFields, setEditingFields] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [sizeWidth, setSizeWidth] = useState("")
  const [sizeHeight, setSizeHeight] = useState("")
  const [isTranslating, setIsTranslating] = useState(false)
  const [featureInputs, setFeatureInputs] = useState<Record<FeatureType, string>>({
    care_and_warranty: "",
    technical_info: "",
  })

  const [productNameInput, setProductNameInput] = useState<MultiLanguageText>({ en: "", ru: "", tr: "" })
  const [descriptionInput, setDescriptionInput] = useState<MultiLanguageText>({ en: "", ru: "", tr: "" })
  const [colorInput, setColorInput] = useState<MultiLanguageText>({ en: "", ru: "", tr: "" })
  const [collectionInput, setCollectionInput] = useState<MultiLanguageText>({ en: "", ru: "", tr: "" })
  const [styleInput, setStyleInput] = useState<MultiLanguageText>({ en: "", ru: "", tr: "" })
  const [imageInput, setImageInput] = useState("")

  const addImageItem = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const url = imageInput.trim()
      if (!url) return
      setForm(prev => ({ ...prev, images: [...prev.images, url] }))
      setImageInput("")
    }
  }

  const debouncedProductName = useDebounce(productNameInput[locale as LanguageCode], 700)
  const debouncedDescription = useDebounce(descriptionInput[locale as LanguageCode], 700)
  const debouncedColor = useDebounce(colorInput[locale as LanguageCode], 700)
  const debouncedCollection = useDebounce(collectionInput[locale as LanguageCode], 700)
  const debouncedStyle = useDebounce(styleInput[locale as LanguageCode], 700)

  const translateText = async (
    text: string,
    sourceLang: LanguageCode
  ): Promise<Partial<Record<LanguageCode, string>>> => {
    if (!text.trim() || text.length <= 2) return {}

    const targets = LANGUAGES.filter((l) => l.code !== sourceLang).map((l) => l.code)

    try {
      setIsTranslating(true)
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang: sourceLang, value: text }),
      })
      const data = await res.json()

      if (data.translations) {
        const translations: Partial<Record<LanguageCode, string>> = {}
        targets.forEach((target) => {
          if (data.translations[target]) translations[target] = data.translations[target]
        })
        return translations
      }
      return {}
    } catch (err) {
      console.error("Translation error:", err)
      return {}
    } finally {
      setIsTranslating(false)
    }
  }

  useEffect(() => {
    if (!debouncedProductName || debouncedProductName.length <= 2) return
    const translate = async () => {
      const translations = await translateText(debouncedProductName, locale as LanguageCode)
      if (Object.keys(translations).length > 0) {
        setForm((prev) => ({ ...prev, product_name: { ...prev.product_name, ...translations } }))
      }
    }
    translate()
  }, [debouncedProductName, locale])

  useEffect(() => {
    if (!debouncedDescription || debouncedDescription.length <= 2) return
    const translate = async () => {
      const translations = await translateText(debouncedDescription, locale as LanguageCode)
      if (Object.keys(translations).length > 0) {
        setForm((prev) => ({ ...prev, description: { ...prev.description, ...translations } }))
      }
    }
    translate()
  }, [debouncedDescription, locale])

  useEffect(() => {
    if (!debouncedColor || debouncedColor.length <= 2) return
    const translate = async () => {
      const translations = await translateText(debouncedColor, locale as LanguageCode)
      if (Object.keys(translations).length > 0) {
        setForm((prev) => ({ ...prev, color: { ...prev.color, ...translations } }))
      }
    }
    translate()
  }, [debouncedColor, locale])

  useEffect(() => {
    if (!debouncedCollection || debouncedCollection.length <= 2) return
    const translate = async () => {
      const translations = await translateText(debouncedCollection, locale as LanguageCode)
      if (Object.keys(translations).length > 0) {
        setForm((prev) => ({ ...prev, collection: { ...prev.collection, ...translations } }))
      }
    }
    translate()
  }, [debouncedCollection, locale])

  useEffect(() => {
    if (!debouncedStyle || debouncedStyle.length <= 2) return
    const translate = async () => {
      const translations = await translateText(debouncedStyle, locale as LanguageCode)
      if (Object.keys(translations).length > 0) {
        setForm((prev) => ({ ...prev, style: { ...prev.style, ...translations } }))
      }
    }
    translate()
  }, [debouncedStyle, locale])

  const handleMultilingualChange = (
    field: keyof Pick<FormData, "product_name" | "description" | "color" | "collection" | "style">,
    lang: LanguageCode,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: { ...prev[field], [lang]: value } }))

    if (field === "product_name") setProductNameInput((prev) => ({ ...prev, [lang]: value }))
    if (field === "description") setDescriptionInput((prev) => ({ ...prev, [lang]: value }))
    if (field === "color") setColorInput((prev) => ({ ...prev, [lang]: value }))
    if (field === "collection") setCollectionInput((prev) => ({ ...prev, [lang]: value }))
    if (field === "style") setStyleInput((prev) => ({ ...prev, [lang]: value }))
  }

  const handleDirectEdit = (
    field: keyof Pick<FormData, "product_name" | "description" | "color" | "collection" | "style">,
    lang: LanguageCode,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: { ...prev[field], [lang]: value } }))
  }

  const toggleEdit = (fieldKey: string) => setEditingFields((prev) => ({ ...prev, [fieldKey]: !prev[fieldKey] }))

  // Features functions
  const handleFeatureChange = async (featType: keyof Features, lang: LanguageCode, value: string) => {
    if (featType === "head") {
      setForm((prev) => ({
        ...prev,
        features: { ...prev.features, [lang as LanguageCode]: { ...prev.features[lang as LanguageCode], head: value } },
      }))
      if (lang === locale && value.trim().length > 2) {
        const translations = await translateText(value, lang)
        Object.entries(translations).forEach(([targetLang, translatedText]) => {
          if (translatedText) {
            setForm((prev) => ({
              ...prev,
              features: {
                ...prev.features,
                [targetLang as LanguageCode]: { ...prev.features[targetLang as LanguageCode], head: translatedText },
              },
            }))
          }
        })
      }
    }
  }

  const handleFeatureListInput = (featType: FeatureType, value: string) => {
    setFeatureInputs((prev) => ({ ...prev, [featType]: value }))
  }

  const addFeatureItem = async (featType: FeatureType, e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      const value = featureInputs[featType].trim()
      if (!value) return

      const currentLang = locale as LanguageCode
      setForm((prev) => ({
        ...prev,
        features: {
          ...prev.features,
          [currentLang]: { ...prev.features[currentLang], [featType]: [...prev.features[currentLang][featType], value] },
        },
      }))

      const translations = await translateText(value, currentLang)
      Object.entries(translations).forEach(([targetLang, translatedText]) => {
        if (translatedText) {
          setForm((prev) => ({
            ...prev,
            features: {
              ...prev.features,
              [targetLang as LanguageCode]: {
                ...prev.features[targetLang as LanguageCode],
                [featType]: [...prev.features[targetLang as LanguageCode][featType], translatedText],
              },
            },
          }))
        }
      })

      setFeatureInputs((prev) => ({ ...prev, [featType]: "" }))
    }
  }

  const removeFeatureItem = (featType: FeatureType, lang: LanguageCode, index: number) => {
    setForm((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [lang]: { ...prev.features[lang], [featType]: prev.features[lang][featType].filter((_, i) => i !== index) },
      },
    }))
  }
  const renderMultilingualInput = (
    field: keyof Pick<FormData, "product_name" | "description" | "color" | "collection" | "style">,
    multiline = false,
    label = ""
  ) => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {LANGUAGES.map((lang) => {
            const isPrimary = lang.code === locale
            const fieldKey = `${field}_${lang.code}`
            const isEditing = editingFields[fieldKey]
            const Component = multiline ? Textarea : Input

            return (
              <div key={lang.code} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Badge variant={isPrimary ? "default" : "secondary"} className={`text-xs ${isPrimary ? "bg-blue-600" : "bg-gray-100"}`}>
                    <Globe className="w-3 h-3 mr-1" />
                    {lang.flag} {lang.name} {isPrimary && "(Primary)"}
                  </Badge>
                  {!isPrimary && (
                    <Button size="sm" variant="ghost" onClick={() => toggleEdit(fieldKey)} className="h-6 px-2 text-xs hover:bg-orange-100">
                      {isEditing ? <Save className="w-3 h-3" /> : <Edit2 className="w-3 h-3" />}
                    </Button>
                  )}
                </div>

                <div className="relative">
                  <Component
                    placeholder={`${label || dictionary?.addProduct?.fields?.[field] || field} (${lang.name})`}
                    value={form[field][lang.code]}
                    onChange={(e) => {
                      if (isPrimary) handleMultilingualChange(field, lang.code, e.target.value)
                      else if (isEditing) handleDirectEdit(field, lang.code, e.target.value)
                    }}
                    readOnly={!isPrimary && !isEditing}
                    className={`transition-all duration-200 ${isPrimary ? "border-2 border-blue-500 bg-blue-50/50 shadow-sm" : ""} ${!isPrimary && !isEditing ? "bg-gray-50 cursor-pointer hover:bg-gray-100" : ""} ${isEditing && !isPrimary ? "border-2 border-orange-400 bg-orange-50/50" : ""}`}
                    onClick={() => { if (!isPrimary && !isEditing) toggleEdit(fieldKey) }}
                    rows={multiline ? 4 : undefined}
                  />
                  {isTranslating && !isPrimary && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    </div>
                  )}
                </div>

                {errors[`${field}_${lang.code}`] && <span className="text-red-500 text-xs">{errors[`${field}_${lang.code}`]}</span>}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // --- Features renderer (head + care/warranty + technical) ---
  const renderFeatures = () => {
    return (
      <div className="space-y-6">
        
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 flex items-center">
            <Star className="w-4 h-4 mr-2" />
            {dictionary?.addProduct?.features?.head || "Head Feature"}
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {LANGUAGES.map((lang) => {
              const isPrimary = lang.code === locale
              return (
                <div key={lang.code} className="space-y-2">
                  <Badge variant={isPrimary ? "default" : "secondary"} className="text-xs">
                    <Globe className="w-3 h-3 mr-1" />
                    {lang.flag} {lang.name} {isPrimary && "(Primary)"}
                  </Badge>
                  <Input
                    placeholder={`Head feature (${lang.name})`}
                    value={form.features[lang.code].head}
                    onChange={(e) => { if (isPrimary) handleFeatureChange("head", lang.code, e.target.value) }}
                    readOnly={!isPrimary}
                    className={isPrimary ? "border-2 border-blue-500 bg-blue-50/50" : "bg-gray-50"}
                  />
                </div>
              )
            })}
          </div>
        </div>

        
        {["care_and_warranty", "technical_info"].map((featType) => (
          <div key={featType} className="space-y-3">
            <h4 className="font-medium text-gray-700 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              {featType === "care_and_warranty" ? (dictionary?.addProduct?.features?.careWarranty || "Care & Warranty") : (dictionary?.addProduct?.features?.technicalInfo || "Technical Info")}
            </h4>

            
            <div className="mb-4">
              <Input
                placeholder={`Add ${featType.replace('_', ' ')} item (Press Enter or Space to add)`}
                value={featureInputs[featType as keyof typeof featureInputs]}
                onChange={(e) => handleFeatureListInput(featType as "care_and_warranty" | "technical_info", e.target.value)}
                onKeyDown={(e) => addFeatureItem(featType as "care_and_warranty" | "technical_info", e)}
                className="border-2 border-green-500 bg-green-50/50"
              />
              <p className="text-xs text-gray-500 mt-1">Press Enter or Space to add item. Items will be auto-translated.</p>
            </div>

            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {LANGUAGES.map((lang) => (
                <div key={lang.code} className="space-y-1">
                  <Badge variant={lang.code === locale ? "default" : "secondary"} className="text-xs mb-1">
                    <Globe className="w-3 h-3 mr-1" />
                    {lang.flag} {lang.name} {lang.code === locale && "(Primary)"}
                  </Badge>
                  <div className="flex flex-wrap gap-2">
                    {form.features[lang.code][featType].map((item, idx) => (
                      <Badge key={idx} variant="outline" className="cursor-pointer" onClick={() => removeFeatureItem(featType as "care_and_warranty" | "technical_info", lang.code as LanguageCode, idx)}>
                        {item} <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }
  const addSize = () => {
    if (!sizeWidth || !sizeHeight) return
    const newSize = `${sizeWidth} x ${sizeHeight} cm`
    setForm(prev => ({ ...prev, sizes: [...prev.sizes, newSize] }))
    setSizeWidth("")
    setSizeHeight("")
  }

  const removeSize = (index: number) => {
    setForm(prev => ({ ...prev, sizes: prev.sizes.filter((_, i) => i !== index) }))
  }

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}


    const requiredFields: Array<keyof Pick<FormData, "product_name" | "description">> = ["product_name", "description"]

    requiredFields.forEach(field => {
      if (!form[field][locale as LanguageCode].trim()) {
        newErrors[`${field}_${locale}`] = dictionary?.addProduct?.validation?.required || "This field is required"
      }
    })

    if (!form.price || form.price <= 0) {
      newErrors["price"] = dictionary?.addProduct?.validation?.priceRequired || "Price is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      const res = await fetch("/api/product/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error("Failed to save product")


      setForm({
        id: Date.now(),
        product_name: { en: "", ru: "", tr: "" },
        description: { en: "", ru: "", tr: "" },
        features: {
          en: { head: "", care_and_warranty: [], technical_info: [] },
          ru: { head: "", care_and_warranty: [], technical_info: [] },
          tr: { head: "", care_and_warranty: [], technical_info: [] },
        },
        color: { en: "", ru: "", tr: "", value: "" },
        collection: { en: "", ru: "", tr: "", value: "" },
        style: { en: "", ru: "", tr: "", value: "" },
        product_code: "",
        price: 0,
        images: [],
        sizes: [],
        isNew: false,
        isRunners: false,
        inStock: true,
      })
      setErrors({})
      setFeatureInputs({ care_and_warranty: "", technical_info: "" })
      alert(dictionary?.addProduct?.messages?.success || "Product saved successfully!")

    } catch (err) {
      console.error(err)
      alert(dictionary?.addProduct?.messages?.error || "Error saving product")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white p-8 rounded-2xl shadow-2xl">
          <div className="flex items-center space-x-3">
            <Package className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">
                {dictionary?.addProduct?.title || "Add New Product"}
              </h1>
              <p className="mt-2 text-blue-100 text-lg">
                {dictionary?.addProduct?.subtitle || "Create a multilingual product listing"}
              </p>
            </div>
          </div>
        </div>

        
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="text-xl flex items-center text-gray-800">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              {dictionary?.addProduct?.sections?.productName || "Product Name"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {renderMultilingualInput("product_name", false)}
          </CardContent>
        </Card>

        
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <CardTitle className="text-xl flex items-center text-gray-800">
              <FileText className="w-5 h-5 mr-2 text-green-600" />
              {dictionary?.addProduct?.sections?.description || "Description"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {renderMultilingualInput("description", true)}
          </CardContent>
        </Card>

        
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <CardTitle className="text-xl flex items-center text-gray-800">
              <Star className="w-5 h-5 mr-2 text-purple-600" />
              {dictionary?.addProduct?.sections?.features || "Features"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {renderFeatures()}
          </CardContent>
        </Card>

        
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b">
            <CardTitle className="text-xl flex items-center text-gray-800">
              <Palette className="w-5 h-5 mr-2 text-orange-600" />
              {dictionary?.addProduct?.sections?.metaData || "Product Attributes"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            
            <div>
              <h4 className="font-semibold text-gray-700 mb-4 flex items-center">
                <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-pink-400 rounded-full mr-2"></div>
                {dictionary?.addProduct?.fields?.color || "Color"}
              </h4>
              {renderMultilingualInput("color", false)}
            </div>

            
            <div>
              <h4 className="font-semibold text-gray-700 mb-4 flex items-center">
                <Package className="w-4 h-4 mr-2 text-blue-500" />
                {dictionary?.addProduct?.fields?.collection || "Collection"}
              </h4>
              {renderMultilingualInput("collection", false)}
            </div>

            
            <div>
              <h4 className="font-semibold text-gray-700 mb-4 flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                {dictionary?.addProduct?.fields?.style || "Style"}
              </h4>
              {renderMultilingualInput("style", false)}
            </div>
          </CardContent>
        </Card>


          <div className="mb-4">
            <Input
              placeholder="Add image URL (press Enter)"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              onKeyDown={addImageItem}
              className="border-2 border-cyan-500 bg-cyan-50/50"
            />
            <p className="text-xs text-gray-500 mt-1">Press Enter to add image to list.</p>
          </div>

          
          <div className="flex flex-wrap gap-2">
            {form.images.map((img, idx) => (
              <Badge key={idx} variant="outline" className="cursor-pointer" onClick={() => {
                setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))
              }}>
                {img} <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
          </div>

          <Card className="shadow-xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-green-50 border-b">
              <CardTitle className="text-xl flex items-center text-gray-800">
                <Ruler className="w-5 h-5 mr-2 text-teal-600" />
                {dictionary?.addProduct?.sections?.sizes || "Product Sizes"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex gap-3 mb-4">
                <Input
                  type="number"
                  placeholder={dictionary?.addProduct?.fields?.width || "Width"}
                  value={sizeWidth}
                  onChange={(e) => setSizeWidth(e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder={dictionary?.addProduct?.fields?.height || "Height"}
                  value={sizeHeight}
                  onChange={(e) => setSizeHeight(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={addSize} className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {form.sizes.map((size, i) => (
                  <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="font-medium text-gray-700">{size}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSize(i)}
                      className="h-8 w-8 p-0 hover:bg-red-100 text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              {form.sizes.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-8 italic">
                  {dictionary?.addProduct?.counters?.noSizes || "No sizes added yet"}
                </p>
              )}
            </CardContent>
          </Card>

        
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b">
            <CardTitle className="text-xl flex items-center text-gray-800">
              <Package className="w-5 h-5 mr-2 text-gray-600" />
              {dictionary?.addProduct?.sections?.details || "Product Details"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {dictionary?.addProduct?.fields?.productCode || "Product Code"}
                </label>
                <Input
                  placeholder={dictionary?.addProduct?.placeholders?.productCodeExample || "e.g. PRD-001"}
                  value={form.product_code}
                  onChange={(e) => setForm(prev => ({ ...prev, product_code: e.target.value }))}
                  className="h-12"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {dictionary?.addProduct?.fields?.price || "Price"}
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={form.price || ""}
                  onChange={(e) => setForm(prev => ({ ...prev, price: Number(e.target.value) || 0 }))}
                  className="h-12"
                />
                {errors.price && <span className="text-red-500 text-sm mt-1">{errors.price}</span>}
              </div>
            </div>
          </CardContent>
        </Card>

        
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <label className="flex items-center space-x-3 p-4 border-2 rounded-xl hover:bg-green-50 hover:border-green-300 cursor-pointer transition-all group">
                <Checkbox
                  checked={form.isNew}
                  onCheckedChange={(v) => setForm(prev => ({ ...prev, isNew: Boolean(v) }))}
                />
                <span className="font-semibold text-gray-700 group-hover:text-green-700">🆕 New Product</span>
              </label>
              <label className="flex items-center space-x-3 p-4 border-2 rounded-xl hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all group">
                <Checkbox
                  checked={form.isRunners}
                  onCheckedChange={(v) => setForm(prev => ({ ...prev, isRunners: Boolean(v) }))}
                />
                <span className="font-semibold text-gray-700 group-hover:text-blue-700">🏃‍♂️ Runner Collection</span>
              </label>
              <label className="flex items-center space-x-3 p-4 border-2 rounded-xl hover:bg-purple-50 hover:border-purple-300 cursor-pointer transition-all group">
                <Checkbox
                  checked={form.inStock}
                  onCheckedChange={(v) => setForm(prev => ({ ...prev, inStock: Boolean(v) }))}
                />
                <span className="font-semibold text-gray-700 group-hover:text-purple-700">📦 In Stock</span>
              </label>
            </div>
          </CardContent>
        </Card>

        
        <div className="flex justify-end sticky bottom-4 z-10">
          <Button
            size="lg"
            onClick={handleSubmit}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 rounded-xl"
            disabled={isTranslating}
          >
            {isTranslating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Translating...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Product
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
