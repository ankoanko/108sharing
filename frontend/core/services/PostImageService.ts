import { AxiosInstance } from 'axios'
import { IJsonApiSerializer } from '../JsonApiSerializer'

class PostService {
  public httpClient: AxiosInstance
  public serializer: IJsonApiSerializer

  constructor(httpClient: AxiosInstance, serializer: IJsonApiSerializer) {
    this.httpClient = httpClient
    this.serializer = serializer
  }

  public async create(post, image) {
    const formData = new FormData()
    formData.append('post_image[image]', image.file)
    formData.append('post_image[post_id]', post.id)
    const { data } = await this.httpClient.post(`/api/post_images`, formData)
    const { flush } = data
    const postImage = this.serializer.parseResourceData(data.post_image, data.post_image.data)

    return { postImage, flush }
  }

  public async update(id, params) {
    const formData = new FormData()

    Object.keys(params).forEach(key => {
      formData.append(`post_image[${key}]`, params[key])
    })

    const { data } = await this.httpClient.patch(`/api/post_images/${id}`, formData)
    const { flush } = data
    const postImage = this.serializer.parseResourceData(data.post_image, data.post_image.data)

    return { postImage, flush }
  }

  public async delete(id) {
    const { data } = await this.httpClient.delete(`/api/post_images/${id}`)
    const { flush } = data

    return { flush }
  }
}

export default PostService
