import { useState, useEffect, useCallback } from "react";
import * as React from "react";
import { observer } from "mobx-react-lite";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { Form, Label, List, Segment } from "semantic-ui-react";
import { FieldRenderProps } from "react-final-form";

import { Loader } from "@googlemaps/js-api-loader";
import LoadingComponent from "../../../app/layout/LoadingComponent";

interface IProps extends FieldRenderProps<string, HTMLInputElement> {
  setLatlng: React.Dispatch<React.SetStateAction<google.maps.LatLngLiteral>>;
  Options: {};
}

export const ActivityFormPlacesAutocomplete: React.FC<IProps> = ({
  setLatlng,
  Options,
  input,
  placeholder,
  meta: { touched, error },
}) => {
  const [dropdownIsOpen, setdropdownIsOpen] = useState(false);
  const [address, setaddress] = useState("");
  const [isloaded, setisloaded] = useState(false);
  const FieldProps = {
    placeholder: placeholder,
    className: "location-search-input",
  };

  const loadGoogleAPI = () => {
    const loader = new Loader({
      // apiKey: "AIzaSyCHYvacLxG7odfjovNDb1GpTHon3BMIXlw",
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
      libraries: ["places"],
    });
    return loader.load();
  };

  useEffect(() => {
    !window?.google?.maps?.places
      ? loadGoogleAPI().then(() => setisloaded(true))
      : setisloaded(true);
  }, [setisloaded]);

  useEffect(() => {
    address &&
      geocodeByAddress(address)
        .then((results) => getLatLng(results[0]))
        .then((latLng) => {
          setLatlng(latLng);
        })
        .catch((error) => console.error("Error", error));
    return () => {};
  }, [address, setLatlng]);

  const handleSelect = (address: string) => {
    setdropdownIsOpen(false);
    setaddress(address);
  };

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    input.onBlur();
    setdropdownIsOpen(false);
    handleSelect(e.currentTarget.value);
  };

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.currentTarget.value.length > 0
        ? setdropdownIsOpen(true)
        : setdropdownIsOpen(false);
      if (e.key === "Enter") {
        input.onChange(e); //trigger validation to work
        handleSelect(e.currentTarget.value);
      }
    },
    [input]
  );

  if (!isloaded) {
    return <LoadingComponent></LoadingComponent>;
  }

  return (
    <Form.Field error={touched && !!error}>
      <PlacesAutocomplete
        value={input.value}
        onChange={() => {}}
        searchOptions={Options}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              // {...input}
              name={input.name}
              onBlur={onBlur}
              onFocus={input.onFocus}
              onKeyUp={handleKeyUp}
              onChange={(e) => {
                getInputProps().onChange(e); //trigger PlacesAutocomplete search
                input.onChange(e); //trigger validation to work
              }}
              value={getInputProps().value}
              placeholder={getInputProps(FieldProps).placeholder}
              className={getInputProps(FieldProps).className}
              autoComplete="off"
            ></input>
            {touched && !!error && (
              <Label basic color="red" data-cy="error-label">
                {error}
              </Label>
            )}

            {loading && <Segment>Loading...</Segment>}

            {dropdownIsOpen && (
              <Segment>
                <List>
                  {suggestions.map((suggestion) => {
                    const className = suggestion.active
                      ? "suggestion-item--active"
                      : "suggestion-item";

                    const style = suggestion.active
                      ? {
                          backgroundColor: "rgb(234, 234, 234)",
                          cursor: "pointer",
                        }
                      : { backgroundColor: "#ffffff", cursor: "pointer" };
                    return (
                      <List.Item
                        key={suggestion.description}
                        data-cy="suggestion-item"
                      >
                        <div
                          {...getSuggestionItemProps(suggestion, {
                            className,
                            style,
                          })}
                          onClick={() => {
                            input.onChange(suggestion.description);
                            handleSelect(suggestion.description);
                          }}
                        >
                          <span>{suggestion.description}</span>
                        </div>
                      </List.Item>
                    );
                  })}
                </List>
              </Segment>
            )}
          </div>
        )}
      </PlacesAutocomplete>
    </Form.Field>
  );
};

export default observer(ActivityFormPlacesAutocomplete);
