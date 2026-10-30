import React, { useState } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Button } from "../components/Button";
import { SearchableSelect } from "../components/SearchableSelect";
import { useDemo } from "../context/Demo";

interface CountryRegionMap {
  [country: string]: string[];
}

const RECEIVING_LOCATIONS: CountryRegionMap = {
  China: ["Guangzhou", "Yiwu", "Shenzhen", "Shanghai", "Ningbo", "Foshan", "Hong Kong"],
  UAE: ["Dubai", "Sharjah", "Abu Dhabi"],
  Turkey: ["Istanbul", "Izmir", "Mersin"],
  India: ["Mumbai", "New Delhi", "Chennai"],
  USA: ["New York", "Los Angeles", "Miami", "Houston"],
  France: ["Paris", "Marseille", "Le Havre"],
  Vietnam: ["Ho Chi Minh City", "Hanoi", "Hai Phong"],
  Thailand: ["Bangkok", "Laem Chabang"],
};

const DELIVERY_LOCATIONS: CountryRegionMap = {
  Cameroon: ["Douala", "Yaoundé", "Bafoussam", "Garoua"],
  Nigeria: ["Lagos", "Abuja", "Port Harcourt", "Kano"],
  "Côte d'Ivoire": ["Abidjan", "San Pedro", "Bouaké"],
  Senegal: ["Dakar", "Thies", "Saint-Louis"],
  Gabon: ["Libreville", "Port-Gentil"],
  Ghana: ["Accra", "Tema", "Kumasi"],
  "DR Congo": ["Kinshasa", "Matadi", "Lubumbashi"],
  Kenya: ["Mombasa", "Nairobi"],
  Togo: ["Lomé"],
  Benin: ["Cotonou"],
};

export const S05CreateRoute: React.FC = () => {
  const { go, back, setDraftRoute } = useDemo();

  const [fromCountry, setFromCountry] = useState("");
  const [fromCity, setFromCity] = useState("");

  const [toCountry, setToCountry] = useState("");
  const [toCity, setToCity] = useState("");

  const receivingCountries = Object.keys(RECEIVING_LOCATIONS);
  const receivingCities =
    fromCountry && RECEIVING_LOCATIONS[fromCountry]
      ? RECEIVING_LOCATIONS[fromCountry]
      : [];

  const deliveryCountries = Object.keys(DELIVERY_LOCATIONS);
  const deliveryCities =
    toCountry && DELIVERY_LOCATIONS[toCountry]
      ? DELIVERY_LOCATIONS[toCountry]
      : [];

  const handleFromCountryChange = (c: string) => {
    setFromCountry(c);
    setFromCity("");
  };

  const handleToCountryChange = (c: string) => {
    setToCountry(c);
    setToCity("");
  };

  const handleCreate = () => {
    setDraftRoute({
      fromCountry,
      fromCity,
      toCountry,
      toCity,
    });
    go("06");
  };

  const canCreate = Boolean(fromCountry && fromCity && toCountry && toCity);

  return (
    <ScreenLayout
      showBack
      onBack={back}
      title="Create route"
      hasNav={false}
      footer={
        <Button
          variant="primary"
          className="w-full"
          disabled={!canCreate}
          onClick={handleCreate}
        >
          Create
        </Button>
      }
    >
      <div className="flex flex-col gap-6 pt-2">
        {/* Receiving end section */}
        <div className="flex flex-col gap-3">
          <span className="text-[17px] font-bold text-[var(--ink)] tracking-tight">
            Receiving end
          </span>

          <div className="flex flex-col gap-3">
            <SearchableSelect
              label="Country"
              value={fromCountry}
              onChange={handleFromCountryChange}
              options={receivingCountries}
              placeholder="Select country"
            />

            <SearchableSelect
              label="City"
              value={fromCity}
              onChange={setFromCity}
              options={receivingCities}
              disabled={!fromCountry || receivingCities.length === 0}
              placeholder={
                !fromCountry
                  ? "Select country first"
                  : receivingCities.length === 0
                  ? "No cities available"
                  : "Select city"
              }
            />
          </div>
        </div>

        {/* Delivery end section */}
        <div className="flex flex-col gap-3">
          <span className="text-[17px] font-bold text-[var(--ink)] tracking-tight">
            Delivery end
          </span>

          <div className="flex flex-col gap-3">
            <SearchableSelect
              label="Country"
              value={toCountry}
              onChange={handleToCountryChange}
              options={deliveryCountries}
              placeholder="Select country"
            />

            <SearchableSelect
              label="City"
              value={toCity}
              onChange={setToCity}
              options={deliveryCities}
              disabled={!toCountry || deliveryCities.length === 0}
              placeholder={
                !toCountry
                  ? "Select country first"
                  : deliveryCities.length === 0
                  ? "No cities available"
                  : "Select city"
              }
            />
          </div>
        </div>
      </div>
    </ScreenLayout>
  );
};
