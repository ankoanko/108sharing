// // TODO 現在route的には未使用、仕様時にstyled->tailwind作業必要
// import * as moment from 'moment'
// import 'moment/locale/ja'
// import * as React from 'react'
// import styled from '@emotion/styled'
// import I18n from '../../../../core/i18n'
// import { IBusinessRegistration } from '../../../../core/interfaces'
// import { BREAKPOINT_TABLET_SMALL } from '../../../../constants/constants'
// import {
//   BUSINESS_REGISTRATION_CORPORATION_TYPES,
//   BUSINESS_REGISTRATION_COUNTRY_TYPES,
//   BUSINESS_REGISTRATION_GENDER_TYPES,
//   BUSINESS_REGISTRATION_INDUSTRY_TYPES,
// } from '../../../../constants/businessRegistration'
// import STATE_CODES from '../../../../constants/stateCodes'
// import { setNativeValue } from '../../../../utils/form'
// import injectGoogleMaps from '../../../../utils/injectGoogleMaps'
// import { Button, DropZoneUploader, InputText, Panel, Select } from '../../../atoms'
// import { Form } from '../../../molecules'
// import SettingsLayout from 'components/layouts/SettingsLayout'
// import { COLORS } from 'constants/colors'
// import { userService } from 'core/services'
//
// interface IProps {
//   businessRegistration?: IBusinessRegistration
//   user: any
// }
//
// const FIELDS = {
//   last_name: 'last_name',
//   first_name: 'first_name',
//   last_name_kana: 'last_name_kana',
//   first_name_kana: 'first_name_kana',
//   birth_year: 'birth_year',
//   birth_month: 'birth_month',
//   birth_day: 'birth_day',
//   gender: 'gender',
//   email: 'email',
//   phone: 'phone',
//   zipcode: 'zipcode',
//   state: 'state',
//   city: 'city',
//   street1: 'street1',
//   street2: 'street2',
//   latitude: 'latitude',
//   longitude: 'longitude',
//   country: 'country',
//   industry: 'industry',
//   corporation_type: 'corporation_type',
//   buisiness_web_url: 'buisiness_web_url',
// }
// interface IImage {
//   front: {
//     image_url: string
//     file?: any
//   }
//   back: {
//     image_url: string
//     file?: any
//   }
// }
// type ImageType = 'front' | 'back'
//
// const BusinessRegistration: React.FC<IProps> = props => {
//   const { user: initialUser } = userService.getUserFromJson(props.user)
//   const [images, setImages] = React.useState<IImage>({
//     front: props.businessRegistration?.identification_front,
//     back: props.businessRegistration?.identification_back,
//   })
//   const [errors, setErrors] = React.useState<{ [key: string]: null | string }>({})
//   const [isSubmitEnabled, setIsSubmitEnabled] = React.useState<boolean>(false)
//   const [selectedYear, setSelectedYear] = React.useState<number>(
//     props.businessRegistration?.birth_year || moment().year()
//   )
//   const [selectedMonth, setSelectedMonth] = React.useState<number>(
//     props.businessRegistration?.birth_month || 1
//   )
//   const approvedFront: boolean =
//     props.businessRegistration?.identification_front_workflow_state === 'approved'
//   const approvedBack: boolean =
//     props.businessRegistration?.identification_back_workflow_state === 'approved'
//
//   const handleSubmit = (initialValues, values) => {
//     const params = { ...values }
//     const currentValues = {}
//     Object.keys(values).forEach(key => {
//       currentValues[key] = String(values[key])
//     })
//     // TODO
//   }
//   const handleUpdateForm = (updatedErrors, updatedIsSubmitEnabled) => {
//     setErrors(updatedErrors)
//     setIsSubmitEnabled(updatedIsSubmitEnabled)
//   }
//
//   const stateOptions = [
//     { value: '', label: '-' },
//     ...STATE_CODES.map(stateName => ({
//       value: stateName,
//       label: stateName,
//     })),
//   ]
//
//   const getLongName = (addressComponents, type) => {
//     let value = null
//
//     addressComponents.some(component => {
//       if (component.types.includes(type)) {
//         value = component.long_name
//         return true
//       }
//     })
//
//     return value
//   }
//
//   const updateGeoCode = address => {
//     if (!google) {
//       return
//     }
//
//     const geocoder = new google.maps.Geocoder()
//     geocoder.geocode({ address }, (results, status) => {
//       if (status !== 'OK') {
//         return
//       }
//       const addressComponents = results[0].address_components
//       const geocodeValues = {
//         country: getLongName(addressComponents, 'country'),
//         state: getLongName(addressComponents, 'administrative_area_level_1'),
//         city: getLongName(addressComponents, 'locality'),
//         street2: getLongName(addressComponents, 'sublocality'),
//         latitude: results[0].geometry.location.lat(),
//         longitude: results[0].geometry.location.lng(),
//       }
//       const updateAdressFieflds = ['state', 'city', 'street1', 'latitude', 'longitude']
//
//       updateAdressFieflds.forEach(field => {
//         if (geocodeValues[field]) {
//           const formElement = document.getElementById(field)
//           setNativeValue(formElement, geocodeValues[field], true)
//         }
//       })
//     })
//   }
//
//   const handleZipcode = e => {
//     const pattern = /^\d{3}-?\d{4}$/g
//     const code = e.target.value
//
//     if (!code.match(pattern)) {
//       return
//     }
//     updateGeoCode(e.target.value)
//   }
//
//   const handleFileSelect = (event, type: ImageType) => {
//     const newImage = event.target.files[0]
//     const fileReader = new FileReader()
//     fileReader.onloadend = (eventRoader: any) => {
//       images[type] = {
//         file: newImage,
//         image_url: eventRoader.target.result,
//       }
//       setImages({
//         ...images,
//       })
//     }
//     fileReader.readAsDataURL(newImage)
//   }
//
//   const onDropHandler = (addedImages, type: ImageType) => {
//     addedImages.forEach(addedImage => {
//       const fileReader = new FileReader()
//       fileReader.onloadend = (event: any) => {
//         setImages({
//           ...images,
//           [type]: {
//             file: addedImage,
//             image_url: event.target.result,
//           },
//         })
//       }
//       fileReader.readAsDataURL(addedImage)
//     })
//   }
//
//   return (
//     <SettingsLayout
//       user={initialUser}
//       main={
//         <S.Main>
//           <Panel title={I18n.t('business_registration.title')}>
//             <Form fields={FIELDS} handleSubmit={handleSubmit} handleUpdateForm={handleUpdateForm}>
//               <S.FormItem>
//                 <InputText
//                   name="last_name"
//                   required={true}
//                   label={I18n.t('business_registration.last_name')}
//                   placeholder={I18n.t('business_registration.last_name')}
//                   defaultValue={props.businessRegistration?.last_name || ''}
//                   error={errors.last_name}
//                 />
//               </S.FormItem>
//               <S.FormItem>
//                 <InputText
//                   name="first_name"
//                   required={true}
//                   label={I18n.t('business_registration.first_name')}
//                   placeholder={I18n.t('business_registration.first_name')}
//                   defaultValue={props.businessRegistration?.first_name || ''}
//                   error={errors.first_name}
//                 />
//               </S.FormItem>
//               <S.FormItem>
//                 <InputText
//                   name="last_name_kana"
//                   required={true}
//                   label={I18n.t('business_registration.last_name_kana')}
//                   placeholder={I18n.t('business_registration.last_name_kana')}
//                   defaultValue={props.businessRegistration?.last_name_kana || ''}
//                   error={errors.last_name_kana}
//                 />
//               </S.FormItem>
//               <S.FormItem>
//                 <InputText
//                   name="first_name_kana"
//                   required={true}
//                   label={I18n.t('business_registration.first_name_kana')}
//                   placeholder={I18n.t('business_registration.first_name_kana')}
//                   defaultValue={props.businessRegistration?.first_name_kana || ''}
//                   error={errors.first_name_kana}
//                 />
//               </S.FormItem>
//               <S.FormItem>
//                 <Select
//                   name="birth_year"
//                   required={true}
//                   label={`${I18n.t('business_registration.birthday')} (${I18n.t(
//                     'business_registration.birth_year'
//                   )})`}
//                   defaultValue={
//                     String(props.businessRegistration?.birth_year) || String(moment().year())
//                   }
//                   error={errors.birth_year}
//                   options={[...Array(150)].map((number, index) => ({
//                     value: String(moment().year() - index),
//                     label: String(moment().year() - index),
//                   }))}
//                   onChangeHandler={event => setSelectedYear(Number(event.currentTarget.value) - 1)}
//                 />
//               </S.FormItem>
//               <S.FormItem>
//                 <Select
//                   name="birth_month"
//                   required={true}
//                   label={`${I18n.t('business_registration.birthday')} (${I18n.t(
//                     'business_registration.birth_month'
//                   )})`}
//                   options={[...Array(12)].map((number, index) => ({
//                     value: String(index + 1),
//                     label: String(index + 1),
//                   }))}
//                   defaultValue={String(props.businessRegistration?.birth_month) || '1'}
//                   error={errors.birth_month}
//                   onChangeHandler={event => setSelectedMonth(event.currentTarget.value)}
//                 />
//               </S.FormItem>
//               <S.FormItem>
//                 <Select
//                   name="birth_day"
//                   required={true}
//                   label={`${I18n.t('business_registration.birthday')} (${I18n.t(
//                     'business_registration.birth_day'
//                   )})`}
//                   options={[
//                     ...Array(moment(`${selectedYear}-${selectedMonth}`, 'YYYY-MM').daysInMonth()),
//                   ].map((number, index) => ({
//                     value: String(index + 1),
//                     label: String(index + 1),
//                   }))}
//                   defaultValue={String(props.businessRegistration?.birth_day) || '1'}
//                   error={errors.birth_day}
//                 />
//               </S.FormItem>
//               <S.FormItem>
//                 <Select
//                   required={true}
//                   name="gender"
//                   label={I18n.t('business_registration.gender')}
//                   options={BUSINESS_REGISTRATION_GENDER_TYPES}
//                   defaultValue={props.businessRegistration?.gender || 'male'}
//                   error={errors.gender}
//                 />
//               </S.FormItem>
//               <S.FormItem>
//                 <InputText
//                   name="email"
//                   required={true}
//                   label={I18n.t('generic.email')}
//                   placeholder={I18n.t('business_registration.placeholder.email')}
//                   defaultValue={props.businessRegistration?.email || ''}
//                   error={errors.email}
//                 />
//               </S.FormItem>
//               <S.FormItem>
//                 <InputText
//                   name="phone"
//                   required={true}
//                   label={I18n.t('business_registration.phone')}
//                   placeholder={I18n.t('business_registration.placeholder.phone')}
//                   defaultValue={props.businessRegistration?.phone || ''}
//                   error={errors.phone}
//                   type="tel"
//                 />
//               </S.FormItem>
//               <S.FormItem>
//                 <InputText
//                   name="zipcode"
//                   required={true}
//                   label={I18n.t('generic.zipcode')}
//                   placeholder={I18n.t('business_registration.placeholder.zipcode')}
//                   defaultValue={props.businessRegistration?.zipcode || ''}
//                   error={errors.zipcode}
//                   onChangeHandler={handleZipcode}
//                 />
//               </S.FormItem>
//               <S.FormItem>
//                 <Select
//                   required={true}
//                   name="state"
//                   label={I18n.t('generic.prefectures')}
//                   options={stateOptions}
//                   defaultValue={props.businessRegistration?.state || ''}
//                   error={errors.state}
//                 />
//               </S.FormItem>
//               <S.FormItem>
//                 <InputText
//                   required={true}
//                   name="city"
//                   label={I18n.t('generic.city')}
//                   defaultValue={props.businessRegistration?.city || ''}
//                   error={errors.city}
//                 />
//               </S.FormItem>
//               <S.FormItem>
//                 <InputText
//                   name="street1"
//                   label={I18n.t('generic.street1')}
//                   defaultValue={props.businessRegistration?.street1 || ''}
//                   error={errors.street1}
//                   required={true}
//                 />
//               </S.FormItem>
//               <S.FormItem>
//                 <InputText
//                   name="street2"
//                   label={I18n.t('generic.street2')}
//                   defaultValue={props.businessRegistration?.street2 || ''}
//                   error={errors.street2}
//                 />
//               </S.FormItem>
//               <S.FormItem hidden={true}>
//                 <InputText
//                   name="latitude"
//                   label="latitude"
//                   defaultValue={String(props.businessRegistration?.latitude)}
//                   error={errors.latitude}
//                 />
//               </S.FormItem>
//               <S.FormItem hidden={true}>
//                 <InputText
//                   name="longitude"
//                   label="longitude"
//                   defaultValue={String(props.businessRegistration?.longitude)}
//                   error={errors.longitude}
//                 />
//               </S.FormItem>
//               <S.FormItem>
//                 <Select
//                   required={true}
//                   name="country"
//                   label={I18n.t('business_registration.country')}
//                   options={BUSINESS_REGISTRATION_COUNTRY_TYPES}
//                   defaultValue={props.businessRegistration?.country || 'JAPAN'}
//                   error={errors.country}
//                 />
//               </S.FormItem>
//               <S.FormItem>
//                 <S.ImageWrapper>
//                   <S.FormItemTitle>{I18n.t('business_registration.id_front')}</S.FormItemTitle>
//                   {approvedFront && (
//                     <S.ApprovedText>{I18n.t('business_registration.approved')}</S.ApprovedText>
//                   )}
//                   {!approvedFront && images.front?.image_url && (
//                     <S.PreviewImage>
//                       <S.ItemImage>
//                         <img src={images.front.image_url} />
//                       </S.ItemImage>
//                       <S.ImageButtons>
//                         <S.FileSelectWrapper>
//                           <label htmlFor="fileSelectUploaderFront">
//                             {I18n.t('generic.change')}
//                             <input
//                               id="fileSelectUploaderFront"
//                               type="file"
//                               accept="image/*"
//                               onChange={event => handleFileSelect(event, 'front')}
//                             />
//                           </label>
//                         </S.FileSelectWrapper>
//                       </S.ImageButtons>
//                     </S.PreviewImage>
//                   )}
//                   {!approvedFront && (
//                     <S.DropZoneWrapper hasImage={images.front ? true : false}>
//                       <DropZoneUploader onDrop={event => onDropHandler(event, 'front')} />
//                     </S.DropZoneWrapper>
//                   )}
//                 </S.ImageWrapper>
//               </S.FormItem>
//               <S.FormItem>
//                 <S.ImageWrapper>
//                   <S.FormItemTitle>{I18n.t('business_registration.id_back')}</S.FormItemTitle>
//                   {approvedBack && (
//                     <S.ApprovedText>{I18n.t('business_registration.approved')}</S.ApprovedText>
//                   )}
//                   {!approvedBack && images.back?.image_url && (
//                     <S.PreviewImage>
//                       <S.ItemImage>
//                         <img src={images.back.image_url} />
//                       </S.ItemImage>
//                       <S.ImageButtons>
//                         <S.FileSelectWrapper>
//                           <label htmlFor="fileSelectUploaderBack">
//                             {I18n.t('generic.change')}
//                             <input
//                               id="fileSelectUploaderBack"
//                               type="file"
//                               accept="image/*"
//                               onChange={event => {
//                                 handleFileSelect(event, 'back')
//                               }}
//                             />
//                           </label>
//                         </S.FileSelectWrapper>
//                       </S.ImageButtons>
//                     </S.PreviewImage>
//                   )}
//                   {!approvedBack && (
//                     <S.DropZoneWrapper hasImage={images.back ? true : false}>
//                       <DropZoneUploader onDrop={event => onDropHandler(event, 'back')} />
//                     </S.DropZoneWrapper>
//                   )}
//                 </S.ImageWrapper>
//               </S.FormItem>
//               <S.FormItem>
//                 <Select
//                   required={false}
//                   name="industry"
//                   label={I18n.t('business_registration.industry')}
//                   options={BUSINESS_REGISTRATION_INDUSTRY_TYPES}
//                   defaultValue={String(props.businessRegistration?.industry) || '5'}
//                   error={errors.industry}
//                 />
//               </S.FormItem>
//               <S.FormItem>
//                 <Select
//                   required={false}
//                   name="corporation_type"
//                   label={I18n.t('business_registration.buisiness_type')}
//                   options={BUSINESS_REGISTRATION_CORPORATION_TYPES}
//                   defaultValue={props.businessRegistration?.corporation_type || 'corporation'}
//                   error={errors.corporation_type}
//                 />
//               </S.FormItem>
//               <S.FormItem>
//                 <InputText
//                   name="buisiness_web_url"
//                   label={I18n.t('business_registration.buisiness_web_url')}
//                   placeholder={I18n.t('business_registration.placeholder.buisiness_web_url')}
//                   defaultValue={props.businessRegistration?.buisiness_web_url || ''}
//                   error={errors.buisiness_web_url}
//                 />
//               </S.FormItem>
//               <Button disabled={!isSubmitEnabled}>{I18n.t('generic.save')}</Button>
//             </Form>
//           </Panel>
//         </S.Main>
//       }
//     />
//   )
// }
//
// const S: any = {}
// S.Main = styled.div`
//   table {
//     border-collapse: collapse;
//     width: 100%;
//   }
//   table td,
//   table th {
//     border-width: 1px 0px; /* 上下だけ引く */
//   }
// `
// S.FormItem = styled.div<{ hidden?: boolean }>`
//   display: ${({ hidden }) => (hidden ? 'none' : 'block')};
//
//   & + & {
//     margin-top: 18px;
//   }
// `
// S.FormItemTitle = styled.p`
//   width: 240px;
//   margin-top: 8px;
//   font-size: 15px;
//   font-weight: bold;
//   line-height: 1;
//
//   @media (max-width: ${BREAKPOINT_TABLET_SMALL}px) {
//     width: 100%;
//     margin-bottom: 12px;
//   }
// `
// S.ApprovedText = styled.div`
//   margin-top: 3px;
//   position: relative;
//   padding-left: 20px;
//
//   &::before {
//     content: '';
//     position: absolute;
//     top: 4px;
//     left: 0;
//     -webkit-transform: rotate(50deg);
//     -ms-transform: rotate(50deg);
//     transform: rotate(50deg);
//     width: 7px;
//     height: 14px;
//     border-right: 3px solid ${COLORS.Primary};
//     border-bottom: 3px solid ${COLORS.Primary};
//   }
// `
//
// S.ImageWrapper = styled.div<{ hasNoImage: boolean }>`
//   display: flex;
//   .DropZoneUploader {
//     width: 100%;
//     flex: 1;
//     margin: 0;
//   }
//
//   @media (max-width: ${BREAKPOINT_TABLET_SMALL}px) {
//     flex-direction: column;
//   }
// `
// S.ItemImage = styled.div`
//   display: block;
//   position: relative;
//   width: 240px;
//   height: inherit;
//   background-color: rgb(244, 244, 244);
//   border-radius: 3px;
//   overflow: hidden;
//   > img {
//     width: inherit;
//     height: inherit;
//     object-fit: contain;
//   }
//   @media (max-width: ${BREAKPOINT_TABLET_SMALL}px) {
//     width: 200px;
//   }
// `
//
// S.DropZoneWrapper = styled.div<{ hasImage: boolean }>`
//   display: block;
//   width: 100%;
//   flex: 1;
//   ${({ hasImage }) =>
//     hasImage &&
//     `
//     display: none;
//   `}
// `
//
// S.PreviewImage = styled.div`
//   display: flex;
// `
//
// S.ImageButtons = styled.div`
//   display: flex;
//   margin-left: 50px;
//   align-items: center;
//   @media (max-width: ${BREAKPOINT_TABLET_SMALL}px) {
//     margin-left: 20px;
//   }
// `
// S.FileSelectWrapper = styled.div`
//   cursor: pointer;
//   margin-right: 12px;
//   display: flex;
//   align-items: center;
//   height: 36px;
//   padding: 0 16px;
//   border-radius: 4px;
//   outline: none;
//   background-color: ${COLORS.Primary};
//   color: #fff;
//   border: none;
//
//   &:hover {
//     opacity: 0.6;
//   }
//   > a {
//     color: #fff;
//   }
//
//   input {
//     width: 0;
//   }
// `
// export default injectGoogleMaps(BusinessRegistration)
