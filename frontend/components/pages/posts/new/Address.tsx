import * as React from 'react'
import I18n from 'core/i18n'
import { IPost } from 'core/interfaces'
import STATE_CODES from 'constants/stateCodes'
import { setNativeValue } from 'utils/form'
import injectGoogleMaps from 'utils/injectGoogleMaps'
import { Button, InputText, Select } from 'components/atoms'
import { Form } from 'components/molecules'

const ADDRESS_FIELDS = {
  zipcode: 'zipcode',
  state: 'state',
  city: 'city',
  street1: 'street1',
  street2: 'street2',
  latitude: 'latitude',
  longitude: 'longitude',
}

interface IErrors {
  [key: string]: string | null
}

interface IProps {
  post: IPost
  handleFormSubmit(initialValues: any, values: any): void
}

export const Address: React.FC<IProps> = props => {
  const [showMap, setShowMap] = React.useState<boolean>(false)
  const [map, setMap] = React.useState(null)
  const [marker, setMarker] = React.useState(null)
  const [isSubmitEnabled, setIsSubmitEnabled] = React.useState(false)
  const [errors, setErrors] = React.useState<IErrors>({})

  const createMap = async coordinate => {
    setShowMap(true)
    const Options = {
      zoom: 15,
      center: coordinate,
      mapTypeId: 'roadmap',
    }
    const initializedMap = new google.maps.Map(document.getElementById('map'), Options)
    const defaultMarker = new google.maps.Marker({
      position: coordinate,
      title: props.post.name,
      map: initializedMap,
    })

    setMarker(defaultMarker)
    setMap(initializedMap)
  }

  const handleUpdateForm = (updatedErrors, updatedIsSubmitEnabled) => {
    setErrors(updatedErrors)
    setIsSubmitEnabled(updatedIsSubmitEnabled)
  }

  const getLongName = (addressComponents, type) => {
    let value = null

    addressComponents.some(component => {
      if (component.types.includes(type)) {
        value = component.long_name
        return true
      }
    })

    return value
  }

  const updateGeoCode = address => {
    if (!google) {
      return
    }

    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ address }, (results, status) => {
      if (status !== 'OK') {
        return
      }
      const addressComponents = results[0].address_components
      const geocodeValues = {
        country: getLongName(addressComponents, 'country'),
        state: getLongName(addressComponents, 'administrative_area_level_1'),
        city: getLongName(addressComponents, 'locality'),
        street2: getLongName(addressComponents, 'sublocality'),
        latitude: results[0].geometry.location.lat(),
        longitude: results[0].geometry.location.lng(),
      }
      const updateAdressFieflds = ['state', 'city', 'street2', 'latitude', 'longitude']

      updateAdressFieflds.forEach(field => {
        if (geocodeValues[field]) {
          const formElement = document.getElementById(field)
          setNativeValue(formElement, geocodeValues[field], true)
        }
      })
    })
  }

  const handleZipcode = e => {
    if (e.target.value.length === 7) {
      updateGeoCode(e.target.value)
    }
  }

  const getFullAddress = () => {
    const adressFieflds = ['state', 'city', 'street2', 'street1']
    let address = ''
    adressFieflds.forEach(field => {
      const formElement: any = document.getElementById(field)
      address += ` ${formElement.value}`
    })

    return address
  }

  const updateGeometry = async () => {
    if (!google) {
      return
    }

    const geocoder = new google.maps.Geocoder()

    geocoder.geocode({ address: getFullAddress() }, async (results, status) => {
      if (status !== 'OK') {
        return
      }
      const geocodeValues = {
        latitude: results[0].geometry.location.lat(),
        longitude: results[0].geometry.location.lng(),
      }
      const updateAdressFieflds = ['latitude', 'longitude']

      updateAdressFieflds.forEach(field => {
        if (geocodeValues[field]) {
          const formElement = document.getElementById(field)
          setNativeValue(formElement, geocodeValues[field], true)
        }
      })

      const LatLng = new google.maps.LatLng(geocodeValues.latitude, geocodeValues.longitude)

      if (!map) {
        createMap(LatLng)
      } else {
        marker.setPosition(LatLng)
        map.panTo(LatLng)
      }
    })
  }

  const stateOptions = [
    { value: '', label: '-' },
    ...STATE_CODES.map(stateName => ({
      value: stateName,
      label: stateName,
    })),
  ]

  const { latitude, longitude } = props.post
  React.useEffect(() => {
    if (latitude && longitude) {
      createMap(new google.maps.LatLng(latitude, longitude))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Form
      fields={ADDRESS_FIELDS}
      handleUpdateForm={handleUpdateForm}
      handleSubmit={props.handleFormSubmit}
    >
      <ul>
        <div className="mt-4">
          <InputText
            required={true}
            name="zipcode"
            label={I18n.t('generic.zipcode')}
            defaultValue={props.post.zipcode}
            error={errors.zipcode}
            onChangeHandler={handleZipcode}
          />
        </div>
        <div className="mt-4">
          <Select
            required={true}
            name="state"
            label={I18n.t('generic.prefectures')}
            options={stateOptions}
            defaultValue={props.post.state}
            error={errors.state}
          />
        </div>
        <div className="mt-4">
          <InputText
            required={true}
            name="city"
            label={I18n.t('generic.city')}
            defaultValue={props.post.city}
            error={errors.city}
            onBlurHandler={updateGeometry}
          />
        </div>
        <div className="mt-4">
          <InputText
            name="street2"
            label={I18n.t('generic.street2')}
            defaultValue={props.post.street2}
            error={errors.street2}
            onBlurHandler={updateGeometry}
          />
        </div>
        <div className="mt-4">
          <InputText
            name="street1"
            label={I18n.t('generic.street1')}
            defaultValue={props.post.street1}
            error={errors.street1}
            onBlurHandler={updateGeometry}
          />
        </div>
        <div hidden={true}>
          <InputText
            name="latitude"
            label="latitude"
            defaultValue={props.post.latitude ? String(props.post.latitude) : ''}
            error={errors.latitude}
          />
        </div>
        <div hidden={true}>
          <InputText
            name="longitude"
            label="longitude"
            defaultValue={props.post.longitude ? String(props.post.longitude) : ''}
            error={errors.longitude}
          />
        </div>
      </ul>
      <div className={`h-72 mt-8 ${!showMap && 'hidden'}`}>
        <div id="map" className="w-full h-full" />
      </div>
      <div className="flex justify-center mt-6">
        <Button type="submit" disabled={!isSubmitEnabled}>
          {I18n.t('generic.update')}
        </Button>
      </div>
    </Form>
  )
}

export default injectGoogleMaps(Address)
