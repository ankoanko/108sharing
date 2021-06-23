export default interface IPayments {
  id: number
  last_name: string
  first_name: string
  last_name_kana: string
  first_name_kana: string
  birth_year: number
  birth_month: number
  birth_day: number
  gender: string
  email: string
  phone: string
  zipcode: string
  state: string
  city: string
  street1: string
  street2: string
  country: string
  identification_front: {
    image_url: string
  }
  identification_back: {
    image_url: string
  }
  identification_front_workflow_state: string
  identification_back_workflow_state: string
  industry: string
  corporation_type: string
  buisiness_web_url: string
  latitude: number
  longitude: number
}
