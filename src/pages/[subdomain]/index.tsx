import { PromogateContext } from "@/application/contexts";
import { api } from "@/config";
import { FetchStoreOffersResponse } from "@/domain/@types";
import { ContentWrapper, Header, OfferCard } from "@/presentation/components";
import { TopBar } from "@/presentation/components/Header/TopBar";
import { getValidSubdomain } from "@/utils/subdomain";
import { useQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { Fragment, useContext } from "react";

type SubdomainPageProps = { subdomain: string, data: FetchStoreOffersResponse; };

export const getServerSideProps: GetServerSideProps = (async (ctx) => {
  const subdomain = getValidSubdomain(ctx.req.headers.host);
  const { data } = await api.get<FetchStoreOffersResponse>(`/resources/offers/${subdomain}`);
  return {
    props: {
      subdomain,
      data
    }
  };
});

export default function SubdomainPage({ subdomain, data: serverData }: SubdomainPageProps) {
  const { fetchStoreOffers } = useContext(PromogateContext);

  const { data } = useQuery<FetchStoreOffersResponse>({
    queryKey: [subdomain, "front-store"],
    queryFn: async () => await fetchStoreOffers(subdomain),
    initialData: serverData,
    cacheTime: 1000 * 60 * 60 * 24,
    staleTime: 1000 * 60 * 60 * 24,
  });

  return (
    <Fragment>
      <Head key={data.data.id}>
        <title>
          {data.data.store_name_display ? `${data.data.store_name_display} - Promogate - Promoções, Cupons de desconto e Ofertas` 
          : "Promogate - Promoções, Cupons de desconto e Ofertas"}
        </title>
        <meta name="lomadee-verification" content={data.data.lomadee_source_id as string} />
        <meta name="verify-admitad" content={data.data.admitad_verification as string} />
        <meta property='og:title' content={`Promogate - ${data.data.store_name_display}`} />
        <meta property='og:description' content="Plataforma Digital Gratuita, Métricas e Compartilhamento para o Afiliado" />
        <meta property='og:type' content='site' />
        <meta property='og:image' content={data.data.store_image} />
        <meta property="og:image:width" content="1080" />
        <meta property="og:image:height" content="1080" />
        <meta property="og:image:alt" content="Promogate - Plataforma Digital Gratuita, Métricas e Compartilhamento para o Afiliado" />
        <meta property='og:site_name' content='Promogate' />
        <meta property='og:locale' content='pt_BR' />
        <meta property='og:url' content={`https://promogate.app/${data.data.store_name}`} />
        <link rel='canonical' content={`https://${data.data.store_name}.promogate.app/`} />
        <meta property='twitter:card' content='summary_large_image' />
        <meta property='twitter:site' content='@promogate' />
        <meta property='twitter:title' content={data.data.store_name} />
        <meta property='twitter:description' content="Plataforma Digital Gratuita, Métricas e Compartilhamento para o Afiliado" />
        <meta property='twitter:image' content={data.data.store_image} />
        <meta property='twitter:creator' content="@promogate" />
        <meta property='fb:app_id' content="106988875737461" />
      </Head>
      <Header storeName={data.data.store_name_display} topBar={<TopBar />} />
      <ContentWrapper>
        <section className="grid lg:grid-cols-5 gap-4">
          {
            data.data.resources.offers.map((offer, index) => {
              return (
                <OfferCard data={offer} storeName={offer.store_name} key={index}/>
              );
            })
          }
        </section>
      </ContentWrapper>
    </Fragment>
  );
}