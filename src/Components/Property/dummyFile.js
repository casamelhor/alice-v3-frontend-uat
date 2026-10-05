import React, { useState } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

export default function AddressSearch({ onAddressSelected, onManualMode }) {
  const [showSuggestions, setShowSuggestions] = useState(true);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
    requestOptions: {
      componentRestrictions: { country: "in" }, // restrict to India
    },
  });

  const handleSelect = async (description) => {
    setValue(description, false);
    clearSuggestions();
    setShowSuggestions(false);

    const results = await getGeocode({ address: description });
    const { lat, lng } = await getLatLng(results[0]);

    onAddressSelected({
      description,
      lat,
      lng,
      ...parseAddress(results[0])
    });
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        placeholder="Search Property"
        value={value}
        disabled={!ready}
        onChange={(e) => {
          setValue(e.target.value);
          setShowSuggestions(true);
        }}
        style={{
          width: "100%",
          padding: "12px",
          border: "1px solid #ccc",
          borderRadius: "4px"
        }}
      />

      {showSuggestions && value.length > 0 && (
        <div
          style={{
            position: "absolute",
            background: "#fff",
            width: "100%",
            boxShadow: "0 2px 8px rgba(0,0,0,.15)",
            zIndex: 9999,
            borderRadius: "4px",
            marginTop: "2px",
          }}
        >
          {/* GOOGLE RESULTS */}
          {status === "OK" && data.map(({ place_id, description }) => (
            <div
              key={place_id}
              onClick={() => handleSelect(description)}
              style={{
                padding: "12px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
            >
              {description}
            </div>
          ))}

          {/* CUSTOM "ENTER MANUALLY" OPTION */}
          <div
            onClick={() => {
              clearSuggestions();
              setShowSuggestions(false);
              onManualMode();
            }}
            style={{
              padding: "12px",
              cursor: "pointer",
              background: "#fafafa",
              fontWeight: "500",
              color: "#444",
            }}
          >
            Not found? Enter address manually
          </div>
        </div>
      )}
    </div>
  );
}

// Helper for extracting fields
const parseAddress = (result) => {
  const components = result.address_components;

  const get = (type) =>
    components.find((c) => c.types.includes(type))?.long_name || "";

  return {
    street: `${get("route")} ${get("street_number")}`,
    city: get("locality"),
    state: get("administrative_area_level_1"),
    country: get("country"),
    postalCode: get("postal_code"),
  };
};
