import { logger } from '../../server/utils/Logger.js'
import { ProxyState } from '../AppState.js'
import { api } from './AxiosService.js'

class ProfileService {
  // NOTE calls to the Server to retreive the profile within the database, path is 'http://localhost:3000/api/account'
  // NOTE pulls the account of the whoever is logged in through Auth0
  async getProfile() {
    try {
      const res = await api.get('account')
      ProxyState.profile = res.data
    } catch (err) {
      logger.log(err)
    }
  }

  // NOTE this function calls to the db, update stats for the end of the game. Appends on the profile in the BE and returns the new stats
  // NOTE listener is active on ProxyState.profile, so will need to recall get profile to update the stats in live time
  async updateStats(results) {
    try {
      const profileId = ProxyState.profile._id
      await api.put('account/' + profileId, results)
      this.getProfile()
    } catch (error) {
      logger.log(error)
    }
  }
}

export const profileService = new ProfileService()
