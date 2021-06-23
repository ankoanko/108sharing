import * as React from 'react'
import makeAsyncScriptLoader from 'react-async-script'
import { Spinner } from '../components/atoms'

const Loading = () => {
  return (
    <div className="my-50vh mx-auto">
      <Spinner />
    </div>
  )
}
function asyncLoader() {
  const element = document.querySelector('meta[name="google-api-key"]')
  const apiKey = element ? element.getAttribute('content') : ''
  const url = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`

  return makeAsyncScriptLoader(url, { globalName: 'google' })(Loading)
}
const AsyncScriptLoader = asyncLoader()

const injectGoogleMaps = (Component: any) => {
  return (props: any) => {
    const [isGoogleLoaded, setGoogleLoaded] = React.useState(false)
    if (isGoogleLoaded) {
      return <Component {...props} />
    }

    return (
      <AsyncScriptLoader
        asyncScriptOnLoad={() => {
          setGoogleLoaded(true)
        }}
      />
    )
  }
}

export default injectGoogleMaps
