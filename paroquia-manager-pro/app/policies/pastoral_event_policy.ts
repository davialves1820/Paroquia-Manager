import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
import Pastoral from '#models/pastoral'

export default class PastoralEventPolicy extends BasePolicy {
    /**
     * Only ADMIN, PADRE or COORDENADOR of the pastoral can manage its events/notices
     */
    async manage(user: User, pastoral: Pastoral): Promise<AuthorizerResponse> {
        if (user.role === 'ADMIN' || user.role === 'PADRE') {
            return true
        }

        if (user.role === 'COORDENADOR') {
            // Check if user is a coordinator of this specific pastoral
            const isCoordinator = await user.related('pastorals')
                .query()
                .where('pastorals.id', pastoral.id)
                .first()

            return !!isCoordinator
        }

        return false
    }

    /**
     * Only ADMIN or PADRE can send global announcements
     */
    async sendGlobal(user: User): Promise<AuthorizerResponse> {
        return user.role === 'ADMIN' || user.role === 'PADRE'
    }
}