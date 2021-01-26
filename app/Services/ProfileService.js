import { ProxyState } from '../AppState.js'
import { api } from './AxiosService.js'

class ProfileService {
  async getProfile() {
    try {
      const res = await api.get('account')
      ProxyState.profile = res.data
      console.log(ProxyState.profile)
    } catch (err) {
      console.error(err)
    }
  }

  // NOTE will need to insert a function here that calls to the db, update stats for the end of the game on the profile in the BE and returns the new stats
  // async updateStats() {
  //   try {
  //     const res = api.put('account/' profileId, results)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
}

export const profileService = new ProfileService()
