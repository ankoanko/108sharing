import { AxiosInstance } from 'axios'
import { IJsonApiSerializer } from '../JsonApiSerializer'

class AdminService {
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

  public getIdentificationsFromJson(data) {
    const identifications = this.serializer.parseResourceData(data, data.data)
    const pagination = { ...data.meta }

    return { identifications, pagination }
  }

  public async approveIdentification(id) {
    const { data } = await this.httpClient.put(`/admin/api/identifications/${id}/approve`)
    const identification = this.serializer.parseResourceData(
      data.identification,
      data.identification.data
    )

    return { identification, flush: data.flush }
  }

  public async declineIdentification(id) {
    const { data } = await this.httpClient.put(`/admin/api/identifications/${id}/decline`)
    const identification = this.serializer.parseResourceData(
      data.identification,
      data.identification.data
    )

    return { identification, flush: data.flush }
  }

  public async createCategory(category) {
    const { data } = await this.httpClient.post(`/admin/api/categories`, { category })
    const createdCategory = this.serializer.parseResourceData(data.category, data.category.data)

    return { createdCategory, flush: data.flush }
  }

  public async updateCategory(category) {
    const { data } = await this.httpClient.patch(`/admin/api/categories/${category.id}`, {
      category,
    })
    const updatedCategory = this.serializer.parseResourceData(data.category, data.category.data)

    return { updatedCategory, flush: data.flush }
  }

  public async deleteCategory(id) {
    const { data } = await this.httpClient.delete(`/admin/api/categories/${id}`)

    return { flush: data.flush }
  }

  public async createTag(tag) {
    const { data } = await this.httpClient.post('/admin/api/tags/', { tag })
    const createdTag = this.serializer.parseResourceData(data.tag, data.tag.data)

    return { createdTag, flush: data.flush }
  }

  public async updateTag(tag) {
    const { data } = await this.httpClient.patch(`/admin/api/tags/${tag.id}`, { tag })
    const updatedTag = this.serializer.parseResourceData(data.tag, data.tag.data)

    return { updatedTag, flush: data.flush }
  }

  public async deleteTag(id) {
    return this.httpClient.delete(`/admin/api/tags/${id}`)
  }

  public async createPost(post) {
    const { data } = await this.httpClient.post(`/admin/api/posts`, post)
    const createdPost = this.serializer.parseResourceData(data.post, data.post.data)

    return { createdPost, flush: data.flush }
  }

  public async updatePost(post) {
    const { data } = await this.httpClient.patch(`/admin/api/posts/${post.id}`, { post })
    const updatedPost = this.serializer.parseResourceData(data.post, data.post.data)

    return { updatedPost, flush: data.flush }
  }

  public async deletePost(id) {
    return await this.httpClient.delete(`/admin/api/posts/${id}`)
  }

  public async createUser(params) {
    const { data } = await this.httpClient.post('/admin/api/users', { user: params })
    const createdUser = this.serializer.parseResourceData(data.user, data.user.data)

    return { createdUser, flush: data.flush }
  }

  public async updateUser(params) {
    const { data } = await this.httpClient.patch(`/admin/api/users/${params.id}`, { user: params })
    const updatedUser = this.serializer.parseResourceData(data.user, data.user.data)

    return { updatedUser, flush: data.flush }
  }

  public async deleteUser(id) {
    const {
      data: { flush },
    } = await this.httpClient.delete(`/admin/api/users/${id}`)

    return { flush }
  }
}

export default AdminService
