import { inject, ref, readonly } from 'vue'
import { AuthStatusCode, SimpleOTP } from '@simpleotp/core'

const SIMPLEOTP_PLUGIN_KEY = 'simpleotp'

class VueSimpleOTP extends SimpleOTP {
  constructor(siteID, apiURL=null) {
    super(siteID, apiURL)

    this._userRef = ref(super.getUser())
    this._isAuthenticatedRef = ref(Boolean(this._userRef.value))
  }

  async authWithURLCode() {
    const resp = await super.authWithURLCode()
    if (resp.code === AuthStatusCode.OK.description) {
      this._isAuthenticatedRef.value = true
      this._userRef.value = this.getUser()
    }
    return resp
  }

  isAuthenticatedRef() {
    return readonly(this._isAuthenticatedRef)
  }

  getUserRef() {
    return readonly(this._userRef)
  }

  signOut() {
    super.signOut()
    this._isAuthenticatedRef.value = false
    this._userRef.value = null
  }
}

/** 
 * @returns {VueSimpleOTP}
*/
export function useSimpleOTP() {
  return inject(SIMPLEOTP_PLUGIN_KEY)
}

export default {
  install(app, options) {
    app.provide(SIMPLEOTP_PLUGIN_KEY, new VueSimpleOTP(options.siteID, options.apiURL))
  }
}