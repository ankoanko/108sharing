import httpClient from '../httpClient'
import JsonApiSerializer from '../JsonApiSerializer'
import AdminService from './AdminService'
import PostImageService from './PostImageService'
import PostService from './PostService'
import ReservationService from './ReservationService'
import SettingsService from './SettingsService'
import UserService from './UserService'
import UtilService from './UtilService'

const jsonApiSerializer = new JsonApiSerializer()

export const postService = new PostService(httpClient, jsonApiSerializer)
export const postImageService = new PostImageService(httpClient, jsonApiSerializer)
export const adminService = new AdminService(httpClient, jsonApiSerializer)
export const userService = new UserService(httpClient, jsonApiSerializer)
export const reservationService = new ReservationService(httpClient, jsonApiSerializer)
export const settingsService = new SettingsService(httpClient, jsonApiSerializer)
export const utilService = new UtilService(httpClient, jsonApiSerializer)
