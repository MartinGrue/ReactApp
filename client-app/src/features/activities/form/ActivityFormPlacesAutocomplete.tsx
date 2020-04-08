import React, { SetStateAction, Dispatch, useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import PlacesAutocomplete from 'react-places-autocomplete';
import { Form, Label } from 'semantic-ui-react';
import { FieldRenderProps, FieldProps } from 'react-final-form';
import { RootStoreContext } from '../../../app/stores/rootStore';

interface IProps
  extends FieldRenderProps<string, HTMLInputElement>,
    FieldProps<string, HTMLInputElement> {
  address: string;
  setaddress: Dispatch<SetStateAction<string>>;
  handleSelect: (address: string) => void;
  Options: {};
}

export const ActivityFormPlacesAutocomplete: React.FC<IProps> = ({
  address,
  setaddress,
  handleSelect,
  Options,
  input,
  placeholder,
  meta: { touched, error, active  },
  name
}) => {
  const rootStore = useContext(RootStoreContext);
  const { disableUpdateForm } = rootStore.profileStore;

  const [dropdownIsOpen, setdropdownIsOpen] = useState(false);
  const FieldProps = {
    placeholder: placeholder,
    className: 'location-search-input'
  };

  return (
    <Form.Field disabled={disableUpdateForm} error={touched && !!error}>
      <PlacesAutocomplete
        value={address}
        onChange={value => {
          setaddress(value);
        }}
        onSelect={value => {
          handleSelect(value);
        }}
        searchOptions={Options}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              name={name}
              onBlur={input.onBlur}
              onFocus={input.onFocus}
              onChange={e => {
                getInputProps().onChange(e);
                input.onChange(e);
              }}
              value={address}
              placeholder={getInputProps(FieldProps).placeholder}
              className={getInputProps(FieldProps).className}
            ></input>
            {touched && !!error && (
              <Label basic color='red'>
                {error}
              </Label>
            )}

            <div
              className={`autocomplete-dropdown-container ${dropdownIsOpen &&!error &&
                'active'}`}
            >
              {loading && <div>Loading...</div>}
              {active &&
                suggestions.map(suggestion => {
                  setdropdownIsOpen(true);
                  const className = suggestion.active
                    ? 'suggestion-item--active'
                    : 'suggestion-item';

                  const style = suggestion.active
                    ? {
                        backgroundColor: 'rgb(234, 234, 234)',
                        cursor: 'pointer'
                      }
                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style
                      })}
                    >
                      <span
                        onClick={() => {
                          setaddress(suggestion.description);
                          setdropdownIsOpen(false);
                        }}
                      >
                        {suggestion.description}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    </Form.Field>
  );
};

export default observer(ActivityFormPlacesAutocomplete);
