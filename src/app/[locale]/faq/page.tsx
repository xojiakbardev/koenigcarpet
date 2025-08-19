import FaqAccordion from '@/components/pages/faq/faqAccordion'
import Banner from '@/components/shared/banner'
import Footer from '@/components/shared/footer'
import React from 'react'

const Faq = () => {
    return (
        <>
            <Banner filter="faq" image="/static/image1.png" />
            <FaqAccordion />
            <Footer />

        </>
    )
}

export const dynamic = "force-dynamic";


export default Faq
