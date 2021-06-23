import { AxiosInstance } from 'axios'
import { IJsonApiSerializer } from '../JsonApiSerializer'

class SettingsService {
  public httpClient: AxiosInstance
  public serializer: IJsonApiSerializer

  constructor(httpClient: AxiosInstance, serializer: IJsonApiSerializer) {
    this.httpClient = httpClient
    this.serializer = serializer
  }

  public getDataFromJson(JsonData) {
    const data = this.serializer.parseResourceData(JsonData, JsonData.data)
    const pagination = { ...JsonData.meta }

    return { data, pagination }
  }

  public async createIdentificationImage(image) {
    const formData = new FormData()
    formData.append('identification_image[image]', image)

    const {
      data: { identifcation, flush },
    } = await this.httpClient.post(`/api/identification_images`, formData)
    const createdIdentificationImage = this.serializer.parseResourceData(
      identifcation,
      identifcation.data
    )

    return { createdIdentificationImage, flush }
  }

  public async updateNotification(formData) {
    const {
      data: { user, flush },
    } = await this.httpClient.patch('/settings/notification', formData)

    return { user, flush }
  }

  public async deleteSocialProfile(provider) {
    const {
      data: { user, flush },
    } = await this.httpClient.delete(`/api/social_profiles/${provider}`)

    return { user, flush }
  }

  public async updateSetting(setting) {
    const { settings, flush } = await this.httpClient.patch(`/admin/api/setting`, setting)

    return { settings, flush }
  }

  public async getCard() {
    // cardをjson apiのレスポンスに
    const { data } = await this.httpClient.get('/api/card')

    return { card: data }
  }

  public async createCard(stripeToken) {
    // cardをjson apiのレスポンスに
    const {
      data: { card, flush },
    } = await this.httpClient.post('/api/card', { stripeToken })

    return { card, flush }
  }

  public async createBankAccount(formData) {
    const { data } = await this.httpClient.post('/api/bank_accounts', formData)
    const { flush } = data
    const createdBankAccount = this.serializer.parseResourceData(data.user, data.bank_account.data)

    return { createdBankAccount, flush }
  }

  public async updateBankAccount(id, formData) {
    const { data } = await this.httpClient.patch(`/api/bank_accounts/${id}`, formData)
    const { flush } = data
    const updatedBankAccount = this.serializer.parseResourceData(data.user, data.bank_account.data)

    return { updatedBankAccount, flush }
  }
}

export default SettingsService
