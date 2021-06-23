import axios from 'axios'
import get from 'lodash-es/get'
import qs from 'qs'
import React from 'react'
import { IWindow } from './interfaces'
import I18n from 'core/i18n'

declare let window: IWindow

const getCSRFToken = () => {
  const element: any = document.querySelector('meta[name=csrf-token]')
  return element.content
}

const axiosClient = axios.create({
  withCredentials: true,
})

axiosClient.interceptors.request.use(
  config => {
    config.headers['X-CSRF-Token'] = getCSRFToken()
    config.headers['X-Requested-With'] = 'XMLHttpRequest'

    // enable nested object
    // https://github.com/axios/axios/issues/738
    config.paramsSerializer = params => {
      return qs.stringify(params, {
        arrayFormat: 'brackets',
        encode: false,
      })
    }
    return config
  },
  error => Promise.reject(error)
)

axiosClient.interceptors.response.use(
  response => response,
  error => {
    const message =
      get(error, 'response.data.errors') ?? get(error, 'response.data.error') ?? error.message
    if (error.response.status === 422) {
      if (typeof message === 'string') {
        window.flashMessages.addMessage({ text: message, type: 'error' })
      } else if (message instanceof Array) {
        message.map(val => window.flashMessages.addMessage({ text: val, type: 'error' }))
      }
    } else {
      window.globalModal.showModal({
        title: message,
        body: <p>{I18n.t('common_errors.system_error')}</p>,
        submitText: I18n.t('button.reload'),
        handleSubmit: () => location.reload(),
      })
    }
    return Promise.reject(error)
  }
)

export const sendGet = (url, params = {}) => {
  return axiosClient.get(url, params)
}

export const sendDelete = (url, params = {}) => {
  return axiosClient.delete(url, params)
}

export const sendPatch = (url, params = {}) => {
  return axiosClient.patch(url, params)
}

export const sendPut = (url, params = {}) => {
  return axiosClient.put(url, params)
}

export const sendPost = (url, params = {}) => {
  return axiosClient.post(url, params)
}

export default axiosClient
