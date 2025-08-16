import Footer from '@/components/shared/footer'
import Navbar from '@/components/shared/navbar'
import { Locale } from '@/localization/config'
import {FC, use} from 'react'

type FilteredRugsProps = {
    params:Promise<{locale:Locale, filter:string, slug:string}>
}

const FilteredRugs:FC<FilteredRugsProps> = ({params}) => {

    const queryParams = use(params)

    console.log(queryParams)
  return (
    <div>
      <Navbar/>
      <Footer/>
    </div>
  )
}

export default FilteredRugs
