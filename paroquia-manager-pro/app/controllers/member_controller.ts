import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import MemberService from '#services/member_service'

@inject()
export default class MemberController {
    constructor(protected memberService: MemberService) { }

    async index() {
        return this.memberService.all()
    }

    async show({ params }: HttpContext) {
        return this.memberService.find(params.id)
    }

    async store({ request }: HttpContext) {
        const data = request.all()
        return this.memberService.create(data)
    }

    async update({ params, request }: HttpContext) {
        const data = request.all()
        return this.memberService.update(params.id, data)
    }

    async destroy({ params }: HttpContext) {
        await this.memberService.delete(params.id)
        return { message: 'Member deleted successfully' }
    }
}
