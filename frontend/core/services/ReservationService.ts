import { AxiosInstance } from 'axios'
import { IJsonApiSerializer, IJsonResource, IJsonResponse } from '../JsonApiSerializer'

class ReservationService {
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

  public parseRelationships(resources: IJsonResponse, resource: IJsonResource | IJsonResource[]) {
    return this.serializer.parseResourceData(resources, resource)
  }

  public getReservationFromJson(data) {
    const reservation = this.serializer.parseResourceData(data, data.data)

    return { reservation }
  }

  public getReservationsFromJson(data) {
    const reservations = this.serializer.parseResourceData(data, data.data)
    const pagination = { ...data.meta }

    return { reservations, pagination }
  }

  public async searchReservations(params) {
    const { data } = await this.httpClient.get(`/api/reservations/search`, { params })
    const reservations = this.serializer.parseResourceData(
      data.reservations,
      data.reservations.data
    )
    const pagination = data.reservations.meta

    return { reservations, pagination }
  }

  public async createReservation(params) {
    const { data } = await this.httpClient.post(`/api/reservations`, { ...params })
    const { flush } = data
    const reservation = this.serializer.parseResourceData(data.reservation, data.reservation.data)

    return { reservation, flush }
  }

  public async approveReservation(id) {
    const { data } = await this.httpClient.put(`/api/reservations/${id}/approve`)
    const { flush } = data
    const reservation = this.serializer.parseResourceData(data.reservation, data.reservation.data)

    return { reservation, flush }
  }

  public async declineReservation(id) {
    const { data } = await this.httpClient.put(`/api/reservations/${id}/decline`)
    const { flush } = data
    const reservation = this.serializer.parseResourceData(data.reservation, data.reservation.data)

    return { reservation, flush }
  }

  public async cancelReservation(id, params) {
    const { data } = await this.httpClient.put(`/api/reservations/${id}/cancel`, params)
    const { flush } = data
    const reservation = this.serializer.parseResourceData(data.reservation, data.reservation.data)

    return { reservation, flush }
  }

  public async refundAmountReservation(id) {
    const { data } = await this.httpClient.get(`/api/reservations/${id}/refund_amount`)
    const { price } = data

    return { price }
  }

  public async createMessage(formData) {
    const { data } = await this.httpClient.post(`/api/messages`, formData)
    const message = this.serializer.parseResourceData(data.message, data.message.data)

    return { message }
  }

  public async createReceipt(config) {
    const { data } = await this.httpClient.post('/api/receipts', { receipt: { ...config } })
    const receipt = this.serializer.parseResourceData(data.receipt, data.receipt.data)

    return { receipt }
  }
}

export default ReservationService
