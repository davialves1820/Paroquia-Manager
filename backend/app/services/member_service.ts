import Member from '#models/member'

export default class MemberService {
  async all() {
    return await Member.all()
  }

  async find(id: number) {
    return await Member.query()
      .where('id', id)
      .preload('sacraments')
      .preload('donations')
      .firstOrFail()
  }

  async create(data: any) {
    return await Member.create(data)
  }

  async update(id: number, data: any) {
    const member = await Member.findOrFail(id)
    member.merge(data)
    await member.save()
    return member
  }

  async delete(id: number) {
    const member = await Member.findOrFail(id)
    await member.delete()
  }
}
