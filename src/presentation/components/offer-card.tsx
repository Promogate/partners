import { OfferWithClicks } from "@/domain/models";
import { parseCurrency, truncateString } from "@/main/utils";
import { Badge, Flex, HStack, Tag, Text } from "@chakra-ui/react";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";

type OfferCardProps = {
  data: OfferWithClicks;
  storeName: string;
};

const inter = Inter({ subsets: ["latin"] });

/*eslint-disable @next/next/no-img-element*/
export function OfferCard({ data, storeName }: OfferCardProps) {
  const store = storeName.toLocaleLowerCase().replace(" ", "-");
  const router = useRouter();
  const productName = data.title.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f,.'‘’"“”+]/g, "").replace(/[\s/]/g, "-");

  const offerUrl = `/${store}/produto/${productName}/?oid=${data.id}&utm_click=1&rid=${data.resources_id}`;

  return (
    <div className="flex flex-col bg-white justify-between border border-gray-200 rounded-lg h-[420px]"
      style={{ fontFamily: inter.style.fontFamily }}>
      <div className="flex-1 flex flex-col p-4">
        <HStack
          spacing={["0.5rem"]}
          marginBottom={["1rem "]}
        >
          <Tag
            colorScheme={"blackAlpha"}
            fontWeight={["normal"]}
            textTransform={["none"]}
          >
            {data.store_name}
          </Tag>
          {data.is_featured ? (
            <Badge
              variant={"outline"}
              colorScheme={"green"}
              fontWeight={["normal"]}
              textTransform={["none"]}
            >
              Destaque
            </Badge>
          ) : null}
        </HStack>
        <div className="rounded-lg overflow-hidden h-[120px] w-[120px] mx-auto">
          <img
            className='object-contain h-full w-full'
            src={data.image}
            alt={data.title}
          />
        </div>
        <div className="my-4 text-center flex flex-col justify-between">
          <h3 className="flex-1 my-2 text-normal">
            {truncateString(data.title)}
          </h3>
          <div>
            <span className="text-red-400 line-through text-xs">
              {data.old_price && data.old_price !== "0" ? parseCurrency(data.old_price) : null}
            </span>
            <p className="text-gray-900 font-black text-xl tracking-wide">
              {parseCurrency(data.price)}
            </p>
          </div>
        </div>
        <Flex
          width={["100%"]}
          justifyContent={["flex-end"]}
          gap={["1rem", "1rem", "1.5rem"]}
        >
          <Text
            as='span'
            color={"gray.400"}
            fontSize={["xs"]}
          >
            {data._count.offer_clicks > 1 ? `${data._count.offer_clicks} visualizações` : `${data._count.offer_clicks} visualização`}
          </Text>
        </Flex>
      </div>
      <a href={data.destination_link} target="_blank">
        <button className="z-50 bg-purple-600 hover:bg-purple-800 border border-purple-600 hover:border-purple-800 
        transition ease-in-out w-full text-white py-2 rounded-b-lg">
          Ver Oferta
        </button>
      </a>
    </div>
  );
}