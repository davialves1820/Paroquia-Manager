import Pastoral from '#models/pastoral'

export default class PastoralService {
    async all() {
        return await Pastoral.query()
            .preload('members')
            .preload('coordinators')
    }

    async find(id: number) {
        return await Pastoral.query()
            .where('id', id)
            .preload('members')
            .preload('coordinators')
            .firstOrFail()
    }

    async create(data: any) {
        const { members, coordinators, ...pastoralData } = data
        const pastoral = await Pastoral.create(pastoralData)

        if (members) {
            await pastoral.related('members').attach(members)
        }

        if (coordinators) {
            await pastoral.related('coordinators').attach(coordinators)
        }

        return await this.find(pastoral.id)
    }

    async update(id: number, data: any) {
        const pastoral = await Pastoral.findOrFail(id)
        const { members, coordinators, ...pastoralData } = data

        pastoral.merge(pastoralData)
        await pastoral.save()

        if (members !== undefined) {
            await pastoral.related('members').sync(members)
        }

        if (coordinators !== undefined) {
            await pastoral.related('coordinators').sync(coordinators)
        }

        return await this.find(pastoral.id)
    }

    async delete(id: number) {
        const pastoral = await Pastoral.findOrFail(id)
        await pastoral.delete()
    }

    async addMember(id: number, memberId: number) {
        const pastoral = await Pastoral.findOrFail(id)
        await pastoral.related('members').attach([memberId])
        return await this.find(pastoral.id)
    }

    async removeMember(id: number, memberId: number) {
        const pastoral = await Pastoral.findOrFail(id)
        await pastoral.related('members').detach([memberId])
        return await this.find(pastoral.id)
    }

    async addCoordinator(id: number, userId: number) {
        const pastoral = await Pastoral.findOrFail(id)
        await pastoral.related('coordinators').attach([userId])
        return await this.find(pastoral.id)
    }

    async removeCoordinator(id: number, userId: number) {
        const pastoral = await Pastoral.findOrFail(id)
        await pastoral.related('coordinators').detach([userId])
        return await this.find(pastoral.id)
    }
}
