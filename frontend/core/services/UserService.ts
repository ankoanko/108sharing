import { AxiosInstance } from 'axios'
import { IJsonApiSerializer } from '../JsonApiSerializer'

class UserService {
  public httpClient: AxiosInstance
  public serializer: IJsonApiSerializer

  constructor(httpClient: AxiosInstance, serializer: IJsonApiSerializer) {
    this.httpClient = httpClient
    this.serializer = serializer
  }

  public getUserFromJson(data) {
    const user = this.serializer.parseResourceData(data, data.data)

    return { user }
  }

  public async signIn(formData) {
    const { headers } = await this.httpClient.post('/users/sign_in', formData)

    return { redirectUrl: headers.location }
  }

  public async createPasswordResetInstruction(email) {
    const { headers } = await this.httpClient.post('/users/password', email)

    return { redirectUrl: headers.location }
  }

  public async resetPassword(formData) {
    const { headers } = await this.httpClient.put('/users/password', formData)

    return { redirectUrl: headers.location }
  }

  public async createConfirmation(email) {
    const { headers } = await this.httpClient.post('/users/confirmation', email)

    return { redirectUrl: headers.location }
  }

  public async createUser(params) {
    const {
      data: { flush },
    } = await this.httpClient.post('/users', { user: params })

    return { flush }
  }

  public async updateUser(formData) {
    const { data } = await this.httpClient.patch('/api/user', formData)
    const { flush } = data
    const updatedUser = this.serializer.parseResourceData(data.user, data.user.data)

    return { updatedUser, flush }
  }

  // 未使用
  public async deleteUser(user) {
    return this.httpClient.delete(`/user/${user.id}`)
  }

  public async updateProfile(formData) {
    const { data } = await this.httpClient.patch('/api/user', formData)
    const { flush } = data
    const updatedUser = this.serializer.parseResourceData(data.user, data.user.data)

    return { updatedUser, flush }
  }

  public async updatePassword(formData) {
    const {
      data: { flush },
    } = await this.httpClient.put('/password', formData)

    return { flush }
  }

  public async getNotifications() {
    const { data } = await this.httpClient.get('/api/notifications/')
    const notifications = this.serializer.parseResourceData(
      data.notifications,
      data.notifications.data
    )

    return { notifications }
  }

  public async createContact(params) {
    return this.httpClient.post(`/api/contacts`, params)
  }
}

export default UserService
