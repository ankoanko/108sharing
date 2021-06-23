export function getMergedFilterParams(fields, filterValue = {}) {
  const currentParams = new URLSearchParams(window.location.search)
  const filterFields = Object.keys(filterValue)
  const params: any = {}

  fields.forEach(param => {
    if (!filterFields.includes(param) && currentParams.has(param)) {
      params[param] = currentParams.get(param)
    }
    if (!filterFields.includes(param) && currentParams.has(`${param}[]`)) {
      params[param] = currentParams.getAll(`${param}[]`)
    }
  })

  filterFields.forEach(filterField => {
    if (
      filterValue[filterField] === null ||
      (Array.isArray(filterValue[filterField]) && filterValue[filterField].length === 0)
    ) {
      delete params[filterField]
    } else {
      params[filterField] = filterValue[filterField]
    }
  })

  return params
}

export function getMergedFilterQueryString(fields, params): string {
  return fields
    .filter(param => params[param])
    .map(param =>
      Array.isArray(params[param])
        ? params[param].map(value => `${param}[]=${value}`).join('&')
        : `${param}=${params[param]}`
    )
    .join('&')
}

export const createQueryParamStringFromObject = obj => {
  const queryParamStr = Object.entries(obj)
    .map<string | string[]>(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map(v => `${key}[]=${v}`)
      } else {
        return value ? `${key}=${value}` : null
      }
    })
    .flat()
    .filter(Boolean)
    .join('&')

  return queryParamStr ? '?' + queryParamStr : ''
}

export const removeFalsyKey = obj => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const isArray = Array.isArray(value)
    const hasValue = !!(isArray ? (value as any[]).length : value)
    if (hasValue) {
      acc[key] = value
    }
    return acc
  }, {})
}
