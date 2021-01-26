import { Auth0Provider } from '@bcwdev/auth0provider'
import { accountService } from '../services/AccountService'
import BaseController from '../utils/BaseController'

export class AccountController extends BaseController {
  constructor() {
    super('api/account')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .get('', this.getUserAccount)
      .put(':profileId', this.updateUserAccount)
  }

  async getUserAccount(req, res, next) {
    try {
      const account = await accountService.getAccount(req.userInfo)
      res.send(account)
    } catch (error) {
      next(error)
    }
  }

  // NOTE this will update the game stats for whether the player wins/loses the game
  async updateUserAccount(req, res, next) {
    try {
      // const updateInfo = await accountService.updateStats(req.userInfo, editData)
    } catch (error) {
      next(error)
    }
  }
}
