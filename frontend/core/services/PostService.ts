import { AxiosInstance, AxiosResponse } from 'axios'
import { IJsonApiSerializer, IJsonResource, IJsonResponse } from '../JsonApiSerializer'
import { IPost } from 'core/interfaces'

type LikeData = { like: { likes_count: number; user_liked: boolean } }

class PostService {
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

  public getPostFromJson(data): { post: IPost } {
    const post = this.serializer.parseResourceData(data, data.data)

    return { post }
  }

  public getPostsFromJson(data): { posts: IPost[]; pagination: any } {
    const posts = this.serializer.parseResourceData(data, data.data)
    const pagination = { ...data.meta }

    return { posts, pagination }
  }

  public async toggleLike(post): Promise<void | LikeData> {
    return this.httpClient
      .put<LikeData>(`/api/posts/${post.id}/toggle_like`)
      .then(res => ({ like: res.data.like }))
      .catch(error => {
        if (error?.response?.status === 401) {
          location.href = '/users/sign_in'
        }
      })
  }

  public async create(params) {
    const { data } = await this.httpClient.post('/api/posts', params)
    const { edit_post_path } = data
    const post = this.serializer.parseResourceData(data.post, data.post.data)

    return { post, edit_post_path }
  }

  public async update(params) {
    const { data } = await this.httpClient.patch(`/api/posts/${params.id}`, { post: params })
    const { flush } = data
    const post = this.serializer.parseResourceData(data.post, data.post.data)

    return { post, flush }
  }

  public async publish(params) {
    const { data } = await this.httpClient.put(`/api/posts/${params.id}/publish`, {})
    const { flush, post_path } = data

    return { flush, post_path }
  }

  public async changeStateFromNewState(params, newState: 'published' | 'closed') {
    if (newState === 'published') {
      return await this.publish(params)
    } else if (newState === 'closed') {
      return await this.close(params)
    }
  }

  public async close(params) {
    const { data } = await this.httpClient.put(`/api/posts/${params.id}/close`)
    const { flush, post_path } = data

    return { flush, post_path }
  }

  public async search(params) {
    const { data } = await this.httpClient.get('/api/posts/search', { params })
    const posts = this.serializer.parseResourceData(data.posts.posts, data.posts.posts.data)
    const pagination = data.posts.posts.meta

    return { posts, pagination }
  }

  public async getFavorites(params) {
    const { data } = await this.httpClient.get('/api/favorites', { params })
    const posts = this.serializer.parseResourceData(data.posts.posts, data.posts.posts.data)
    const pagination = data.posts.posts.meta

    return { posts, pagination }
  }

  public async createCollectionCalendar(post_id, calendar_attributes) {
    const formData = {
      post: { calendar_attributes },
    }
    const { data } = await this.httpClient.post(
      `/api/posts/${post_id}/collection_calendars`,
      formData
    )

    return { flush: data.flush }
  }

  public async getCalendarCollections(
    post_id,
    filter: { month?: string; reserved?: boolean; blocked?: boolean; defined_price?: boolean }
  ) {
    const { data } = await this.httpClient.get(`/api/posts/${post_id}/calendars`, {
      params: { filter },
    })
    const calendarCollections = this.serializer.parseResourceData(
      data.calendars,
      data.calendars.data
    )

    return { calendarCollections }
  }

  public async getCalculation(post_id, selectedDate) {
    const { start_date, end_date } = selectedDate
    const { data } = await this.httpClient.get(`/api/posts/${post_id}/calculate`, {
      params: {
        start_date,
        end_date,
      },
    })

    return { price: data.price }
  }

  public async getRelatedPosts(post) {
    const { data } = await this.httpClient.get(`/api/related_posts/${post.id}`)
    const relatedPosts = this.serializer.parseResourceData(data.posts, data.posts.data)

    return { relatedPosts }
  }

  public async createReview(params) {
    const { data } = await this.httpClient.post(`/api/reviews`, params)
    const review = this.serializer.parseResourceData(data.review, data.review.data)
    return { review, flush: data.flush }
  }

  public async createReviewReply(params) {
    const { data } = await this.httpClient.post(`/api/review_replies`, params)
    const review_reply = this.serializer.parseResourceData(
      data.review_reply,
      data.review_reply.data
    )

    return { review_reply, flush: data.flush }
  }
}

export default PostService
