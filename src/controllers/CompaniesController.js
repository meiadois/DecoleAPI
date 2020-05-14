const database = require('../models');
const Lesson = database.Lesson;
const User = database.User;
const Company = database.Company;
const Step = database.Step;

const { ErrorHandler } = require('../helpers/error');

module.exports = {
    async list(req, res, next) {
        try {
            const _company = await Company.findAll({
                include: [
                    {
                        association: 'sent_likes'
                    },
                    {
                        association: 'received_likes'
                    },
                    {
                        association: 'users'
                    },
                ]
            });
            res.json(_company);
        } catch (err) {
            next(err);
        }
    },
    async index(req, res, next) {
        try {
            var { id } = req.params;

            if (!id) {
                throw new ErrorHandler(404, null);
            }
            var _company = null;
            try {
                _company = await Company.findByPk(id, {
                    include: [
                        {
                            association: 'received_likes'
                        },
                        {
                            association: 'sent_likes'
                        },
                        {
                            association: 'users'
                        }
                    ]
                });
            } catch (err) {
                console.log(err)
            }

            if (_company === null) {
                throw new ErrorHandler(404, `Empresa ${id} não encontrada.`);
            }
            return res.status(200).json(_company);
        } catch (err) {
            next(err);
        }

    },
    async store(req, res, next) {
        try {
            var { name, cep, thumbnail, cnpj, segment_id, description, cellphone, email, visible } = req.body;
            if (!name || !cep || !thumbnail || !cnpj || !segment_id || !description || !cellphone || !email || visible == undefined) {
                console.log("A")
                throw new ErrorHandler(400, null);
            }
            const nResults = await Company.count({ where: { cnpj } });

            if (nResults != 0) {
                throw new ErrorHandler(400, `Já existe uma empresa com o CNPJ [${cnpj}].`);
            }

            const [_company] = await Company.findOrCreate({
                where: { name, cep, thumbnail, cnpj, segment_id, description, cellphone, email, visible }
            }).catch((err) => {
                console.log(err);
                return null;
            });
            if (!_company) {
                throw new ErrorHandler(500, null);
            }

            return res.status(201).json(_company);
        } catch (err) {
            next(err);
        }
    },
    async update(req, res, next) {
        try {
            var { id } = req.params;
            var { name, cep, thumbnail, cnpj, description, segment_id, cellphone, email, visible } = req.body;
            if (!name || !cep || !thumbnail || !segment_id || !description || !cellphone || !email || !visible) {
                throw new ErrorHandler(400, null);
            }

            const _company = await Company.findByPk(id);

            if (!_company) {
                throw new ErrorHandler(404, `Empresa ${id} não encontrada.`);
            }

            _company.name = name;
            _company.cep = cep;
            _company.thumbnail = thumbnail;
            if (cnpj != null) _company.cnpj = cnpj;
            _company.segment_id = segment_id;
            _company.description = description;
            _company.cellphone = cellphone;
            _company.email = email;
            _company.visible = visible;





            var _success = await _company.save().then(() => {
                return true;
            }).catch((err) => {
                console.log(err);
                return false;
            });

            if (!_success) {
                throw new ErrorHandler(500, null);
            }
            return res.status(200).json(_company);
        } catch (err) {
            next(err);
        }

    },
    async delete(req, res, next) {
        try {
            var { id } = req.params;
            if (!id) {
                throw new ErrorHandler(400, null);
            }

            const _company = await Company.findByPk(id);

            if (!_company) {
                throw new ErrorHandler(404, `Empresa ${id} não encontrada.`);
            }

            var _success = await _company.destroy().then(() => {
                return true;
            }).catch((err) => {
                console.log(err);
                return false;
            });

            if (!_success) {
                throw new ErrorHandler(500, null);
            }
            return res.status(204).json({});

        } catch (err) {
            next(err);
        }
    },
    async meList(req, res, next) {
        try {
            var user_id = res.locals.user.id;

            if (!user_id) {
                throw new ErrorHandler(400, null);
            }

            var _company = await Company.findOne({
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'segment_id'],
                },
                include: [
                    {
                        association: 'users',
                        attributes: [],
                        where: {
                            id: user_id
                        }
                    },
                    {
                        association: 'segment',
                        attributes: ['name'],
                    }
                ]
            });
            /*
            const _user = await User.findByPk(user_id, {
                include: [
                    {
                        association: 'companies'
                    },
                    {
                        association: 'segment',
                    }
                ]
            });

            if (!_user) {
                throw new ErrorHandler(404, "Usuário não encontrada");
            }*/

            return res.status(200).json(_company);
        } catch (err) {
            next(err);
        }
    },
    async meIndex(req, res, next) {
        try {
            var { id } = req.params;
            var user_id = res.locals.user.id;

            if (!user_id) {
                throw new ErrorHandler(400, null);
            }

            var nResults = await Company.count({
                where: { id },
            });

            if (nResults == 0) {
                throw new ErrorHandler(404, `Empresa ${id} não encontrada.`);
            }

            var nResults = await User.count({ where: { id: user_id }, });

            if (nResults == 0) {
                throw new ErrorHandler(404, "Usuário não encontrado");
            }

            var _company = await Company.findOne({
                where: {
                    id
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'segment_id'],
                },
                include: [
                    {
                        association: 'users',
                        attributes: [],
                        where: {
                            id: user_id
                        }
                    },
                    {
                        association: 'segment',
                        attributes: ['name'],
                    }
                ]
            });
            if (!_company) {
                throw new ErrorHandler(400, `O usuário ${user_id} não é proprietário da empresa ${id}`);
            }

            return res.status(200).json(_company);
        } catch (err) {
            next(err);
        }
    },
    async meStore(req, res, next) {
        try {
            var user_id = res.locals.user.id;

            var company_ = await Company.findOne(
                {
                    include: [
                        {
                            association: 'users',
                            attributes: [],
                            where: {
                                id: user_id
                            }
                        },
                    ]
                });

            if (company_ != null) {
                throw new ErrorHandler(400, `Já há uma empresa cadastrada pelo usuário [${user_id}].`);
            }

            var { name, cep, thumbnail, cnpj, segment_id, description, cellphone, email, visible } = req.body;
            if (!name || !cep || !thumbnail || !cnpj || !segment_id || !description || !user_id || !cellphone || !email || !visible) {
                throw new ErrorHandler(400, null);
            }
            if (cnpj != null) {
                var nResults = await Company.count({ where: { cnpj } });

                if (nResults != 0) {
                    throw new ErrorHandler(400, `Já existe uma empresa com o CNPJ [${cnpj}].`);
                }
            }


            const _user = await User.findByPk(user_id);
            if (!_user) {
                throw new ErrorHandler(404, "Usuário não encontrada");
            }

            const [_company] = await Company.findOrCreate({
                where: { name, cep, thumbnail, cnpj, segment_id, description, cellphone, email, visible }
            }).catch((err) => {
                console.log(err);
                return null;
            });

            if (!_company) {
                throw new ErrorHandler(500, null);
            }

            var _success = await _user.addCompany([_company]).then(() => {
                return true;
            }).catch((err) => {
                console.log(err);
                return false;
            });

            if (!_success) {
                throw new ErrorHandler(500, null);
            }

            return res.status(201).json(await _company.reload());
        } catch (err) {
            next(err);
        }
    },
    async meUpdate(req, res, next) {
        try {
            var { id } = req.params;
            var user_id = res.locals.user.id;
            var { name, cep, thumbnail, cnpj, segment_id, description, cellphone, email, visible } = req.body;

            if (!name || !cep || !thumbnail || !segment_id || !description || !user_id || !cellphone || !email || !visible) {
                throw new ErrorHandler(400, null);
            }

            if (!user_id) {
                throw new ErrorHandler(400, null);
            }

            var nResults = await Company.count({
                where: { id },
            });

            if (nResults == 0) {
                throw new ErrorHandler(404, `Empresa ${id} não encontrada.`);
            }

            var _company = await Company.findOne({
                where: {
                    id
                },
                include: [
                    {
                        association: 'users',
                        where: {
                            id: user_id
                        }
                    },
                ]
            });

            if (!_company) {
                throw new ErrorHandler(400, `O usuário ${user_id} não é proprietário da empresa ${id}`);
            }

            if (cnpj != null && cnpj != _company.cnpj) {
                var nResults = await Company.count({ where: { cnpj } });

                if (nResults != 0) {
                    throw new ErrorHandler(400, `Já existe uma empresa com o CNPJ [${cnpj}].`);
                }
            }

            _company.name = name;
            _company.cep = cep;
            _company.thumbnail = thumbnail;
            if (cnpj != null) _company.cnpj = cnpj;
            _company.segment_id = segment_id;
            _company.description = description;
            _company.cellphone = cellphone;
            _company.email = email;
            _company.visible = visible;



            var _success = await _company.save().then(() => {
                return true;
            }).catch((err) => {
                console.log(err);
                return false;
            });

            if (!_success) {
                throw new ErrorHandler(500, null);
            }
            return res.status(200).json(_company);
        } catch (err) {
            next(err);
        }
    },
    async meDelete(req, res, next) {
        try {
            var { id } = req.params;
            var user_id = res.locals.user.id;

            if (!user_id) {
                throw new ErrorHandler(400, null);
            }

            var nResults = await Company.count({
                where: { id },
            });

            if (nResults == 0) {
                throw new ErrorHandler(404, `Empresa ${id} não encontrada.`);
            }

            var nResults = await User.count({ where: { id: user_id }, });

            if (nResults == 0) {
                throw new ErrorHandler(404, "Usuário não encontrado");
            }

            var _company = await Company.findOne({
                where: {
                    id
                },
                include: [
                    {
                        association: 'users',
                        where: {
                            id: user_id
                        }
                    },
                ]
            });

            if (!_company) {
                throw new ErrorHandler(400, `O usuário ${user_id} não é proprietário da empresa ${id}`);
            }

            var _success = await _company.destroy().then(() => {
                return true;
            }).catch((err) => {
                console.log(err);
                return false;
            });

            if (!_success) {
                throw new ErrorHandler(500, null);
            }
            return res.status(204).json({});
        } catch (err) {
            next(err);
        }
    },
    /*
    async storeLesson(req, res, next) {
        try {
            var { id } = req.params;
            var { lesson_ids } = req.body;
            if (!id || !lesson_ids) {
                throw new ErrorHandler(400, null);
            }

            const _company = await Company.findByPk(id, {
                include: [
                    {
                        association: 'lessons'
                    },
                ]
            });
            console.log("ROUTE: " + _company);
            if (!_company) {
                throw new ErrorHandler(404, "Rota não encontrada");
            }
            var _lessons = [];

            for (var i in lesson_ids) {
                var _lesson = await Lesson.findByPk(lesson_ids[i]);
                if (!_lesson) {
                    throw new ErrorHandler(404, `Lição ${lesson_id} não encontrada.`);
                }

                _lessons.push(_lesson);
            }


            var _success = await _company.addLessons(_lessons).then(() => {
                return true;
            }).catch((err) => {
                console.log(err);
                return false;
            });

            if (!_success) {
                throw new ErrorHandler(500, null);
            }
            return res.status(201).json(await _company.reload());
        } catch (err) {
            next(err);
        }
    },
    async updateLesson(req, res, next) {
        try {
            var { id } = req.params;
            var { lesson_ids } = req.body;
            if (!id || !lesson_ids) {
                throw new ErrorHandler(400, null);
            }

            const _company = await Company.findByPk(id, {
                include: [
                    {
                        association: 'lessons'
                    },
                ]
            });
            console.log("ROUTE: " + _company);
            if (!_company) {
                throw new ErrorHandler(404, "Rota não encontrada");
            }
            var _lessons = [];

            for (var i in lesson_ids) {
                var _lesson = await Lesson.findByPk(lesson_ids[i]);
                if (!_lesson) {
                    throw new ErrorHandler(404, `Lição ${lesson_id} não encontrada.`);
                }

                _lessons.push(_lesson);
            }


            var _success = await _company.setLessons(_lessons).then((l) => {
                console.log(l)
                return true;
            }).catch((err) => {
                console.log(err);
                return false;
            });

            if (!_success) {
                throw new ErrorHandler(500, null);
            }
            return res.status(201).json(await _company.reload());
        } catch (err) {
            next(err);
        }
    },
    async deleteLesson(req, res, next) {
        try {
            var { id } = req.params;
            var { lesson_ids } = req.body;
            if (!id || !lesson_ids) {
                throw new ErrorHandler(400, null);
            }

            const _company = await Company.findByPk(id, {
                include: [
                    {
                        association: 'lessons'
                    },
                ]
            });
            console.log("ROUTE: " + _company);
            if (!_company) {
                throw new ErrorHandler(404, "Rota não encontrada");
            }
            var _lessons = [];

            for (var i in lesson_ids) {
                var _lesson = await Lesson.findByPk(lesson_ids[i]);
                if (!_lesson) {
                    throw new ErrorHandler(404, `Lição ${lesson_id} não encontrada.`);
                }

                _lessons.push(_lesson);
            }


            var _success = await _company.removeLessons(_lessons).then(() => {
                return true;
            }).catch((err) => {
                console.log(err);
                return false;
            });

            if (!_success) {
                throw new ErrorHandler(500, null);
            }
            return res.status(204).json({});
        } catch (err) {
            next(err);
        }
    },*/


};