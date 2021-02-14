'use strict';

const { Service } = require('egg');

class BaseService extends Service {
  async list(pageNum, pageSize, where) {
    const ctx = this.ctx;
    const result = await ctx.model[this.entity].findAndCountAll({
      limit: pageSize,
      offset: (pageNum - 1) * pageSize,
      where,
      order: [
        [ 'id', 'asc' ],
        [ 'createdAt', 'asc' ],
      ],
    });
    return {
      list: result.rows,
      count: result.count,
    };
  }

  async create(entity) {
    return await this.ctx.model[this.entity].create(entity);
  }

  // async update(entity) {
  //   const result = await this.app.mysql.update(this.entity, entity);
  //   return result.affectedRows > 0;
  // }
  //
  // async destroy(id) {
  //   const result = await this.ctx.model[this.entity].delete(this.entity, { id });
  //   return result.affectedRows > 0;
  // }

  async destroy(id) {
    const ctx = this.ctx;
    const idTemp = Number(id);
    const user = await ctx.model[this.entity].findByPk(idTemp);
    if (!user) {
      ctx.status = 404;
      return;
    }
    return await user.destroy();
  }
}

module.exports = BaseService;
