import { useState } from 'react'
import ReactDOM from 'react-dom'

const FB = () => {
  const FB = {
    init: (appId, version) => {
      window.fbAsyncInit = () => {
        FB.init({
          appId,
          xfbml: true,
          version,
        })
      }
      ;(function (d, s, id) {
        var js,
          fjs = d.getElementsByTagName(s)[0]
        if (d.getElementById(id)) return
        js = d.createElement(s)
        js.id = id
        js.src = `https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=${version}&appId=${appId}`
        fjs.parentNode.insertBefore(js, fjs)
      })(document, 'script', 'facebook-jssdk')
    },

    login: (callback, scope) => {
      FB.getLoginStatus((response) => {
        if (response.status === 'connected') {
          callback(response)
        } else {
          FB.login(
            (response) => {
              callback(response)
            },
            { scope }
          )
        }
      })
    },

    api: (endpoint, params) => {
      return new Promise((resolve, reject) => {
        FB.api(endpoint, params, (response) => {
          if (response && !response.error) {
            resolve(response)
          } else {
            reject(response.error)
          }
        })
      })
    },
  }

  return <div>FB</div>
}
export default FB
