import FilterProduct from "@/components/shared/filterProduct";
import Banner from "@/components/shared/banner";
import Footer from "@/components/shared/footer";
import { Locale } from "@/localization/config";
import { headers } from "next/headers";

type RugsPageProps = {
    params: Promise<{ locale: Locale }>;
    searchParams: Promise<Record<string, string>>;
};
function getBaseUrl(headers: Headers) {
    const host = headers.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

    return `${protocol}://${host}`;
}

const RugsPage = async ({ params, searchParams }: RugsPageProps) => {
    const locale = (await params).locale;
    const urlSearchParams = await searchParams;
    const query = urlSearchParams.query || "";
    const page = urlSearchParams.page || "1";
    const perPage = urlSearchParams.perPage || "12";
    const header = await headers();
    const baseUrl = getBaseUrl(header);

    if (query) {

        const res = await fetch(`${baseUrl}/api/search?query=${query}&page=${page}&limit=${perPage}`,
            {
                cache: "no-store",
                headers: { "accept-language": locale },
            }
        );


        if (!res.ok) {
            throw new Error("Failed to fetch rugs data");
        }


        const { products, total } = await res.json();
        return (
            <div className="flex flex-col min-h-screen">
                <Banner filter={query} image="/static/banner/runners.png" />
                <div className="p-2" />
                <FilterProduct
                    searchParams={urlSearchParams}
                    rugs={products}
                    rugsCount={total}
                />
                <Footer />
            </div>
        );
    }
    return (
        <div className="flex flex-col min-h-screen">
            <Banner filter="" image="/static/banner/runners.png" />
            <div className="p-2" />
            <FilterProduct
                searchParams={urlSearchParams}
                rugs={[]}
                rugsCount={0}
            />            <Footer />
        </div>
    );



};

export default RugsPage;
