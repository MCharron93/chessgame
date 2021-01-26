import { ProxyState } from '../AppState.js'
import { api } from './AxiosService.js'

class ProfileService {
  async getProfile() {
    try {
      const res = await api.get('/profile')
      ProxyState.profile = res.data
      console.log(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  // NOTE will need to insert a function here that stores the stats for the end of the game on the profile in the BE and returns the stats
  
}

export const profileService = new ProfileService()