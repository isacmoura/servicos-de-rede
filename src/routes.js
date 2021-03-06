const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');

const authMiddleware = require('./middlewares/auth');
const OrgController = require('./controllers/OrgController');
const CaseController = require('./controllers/CaseController');
const UserController = require('./controllers/UserController');
const SessionController = require('./controllers/SessionController');
const LogController = require('./controllers/LogController');
const app = require('./app');

const routes = express.Router();

routes.post('/sessions/login', celebrate({
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
        type: Joi.string().required()
    })
}), SessionController.login);

routes.get('/sessions/logout', SessionController.logout);

routes.get('/users', authMiddleware, UserController.get_all_users);

routes.get('/myprofile/', authMiddleware, UserController.get_user);

routes.get('/help/:case_id', authMiddleware, UserController.help_case);

routes.get('/users/cases', authMiddleware, UserController.get_all_user_cases);

routes.post('/users', celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(6),
        phone: Joi.string().required().min(10).max(11),
        address: Joi.string().required(),
        number: Joi.number().required(),
        complement: Joi.optional(),
        city: Joi.string().required(),
        uf: Joi.string().required().length(2)
    })
}), UserController.create)

routes.post('/update/user/', authMiddleware, celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string(),
        email: Joi.string().email(),
        password: Joi.string().min(6),
        phone: Joi.string().min(10).max(11),
        address: Joi.string(),
        number: Joi.number(),
        complement: Joi.optional(),
        city: Joi.string(),
        uf: Joi.string().length(2)
    })
}), UserController.update)

routes.delete('/users/', authMiddleware, UserController.delete);

routes.get('/case/delete/:case_id', authMiddleware, UserController.delete_cause);

routes.get('/orgs', authMiddleware, OrgController.get_all_orgs);

routes.get('/orgs/:id', OrgController.get_org);

routes.post('/orgs', celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required(),
        phone: Joi.string().min(10).max(11),
        address: Joi.string().required(),
        number: Joi.number().required(),
        complement: Joi.optional(),
        city: Joi.string().required(),
        uf: Joi.string().required().length(2),
    })
}), OrgController.create);

routes.post('/update/orgs/', authMiddleware, celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string(),
        email: Joi.string().email(),
        password: Joi.string(),
        phone: Joi.string().min(10).max(11),
        address: Joi.string(),
        number: Joi.number(),
        complement: Joi.optional(),
        city: Joi.string(),
        uf: Joi.string().length(2),
    })
}), OrgController.update);

routes.delete('/orgs/', authMiddleware, OrgController.delete);


routes.get('/cases', authMiddleware, CaseController.get_all_cases);

routes.get('/cases/org/:org_id', CaseController.get_cases_from_org);

routes.get('/cases/:id', CaseController.get_case)

routes.post('/cases/', authMiddleware, celebrate({
    [Segments.BODY]: Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string().required(),
    })
}), CaseController.create);

routes.put('/cases/:id', authMiddleware, celebrate({
    [Segments.BODY]: Joi.object().keys({
        title: Joi.string(),
        description: Joi.string(),
    })
}), CaseController.update);

routes.get('/delete/case/:id', authMiddleware, CaseController.delete);

// Rotas de VIEW da aplicação

routes.get('/', (req, res) => {
    res.render('index');
});

routes.get('/login', (req, res) => {
    res.render('login');
});

routes.get('/user/signup', (req, res) => {
    res.render('sign-up-user');
});

routes.get('/org/signup', (req, res) => {
    res.render('sign-up-org');
});

routes.get('/user/profile/', authMiddleware, async (req, res) => {
    const user_result = await UserController.get_user(req, res);
    const cases_user = await UserController.get_all_user_cases(req, res);

    res.render('user-profile',
    {
        user: user_result,
        cases: cases_user,
    })
});

routes.get('/user/update', authMiddleware, async (req, res) => {
    const user_result = await UserController.get_user(req, res);

    res.render('user-update',
    {
        user: user_result
    })
});

routes.get('/user/dashboard', authMiddleware, async (req, res) => {
    const user_result = await UserController.get_user(req, res);
    const cases_result = await CaseController.get_all_cases(req, res);

    res.render('user-dashboard', {
        user: user_result,
        cases: cases_result,
    });
});

routes.get('/org/profile', authMiddleware, async (req, res) => {
    const org = await OrgController.get_org(req, res);
    const cases = await CaseController.get_cases_from_org(req, res);

    res.render('org-profile', {
        org: org,
        cases: cases
    })
});

routes.get('/org/update', authMiddleware, async (req, res) => {
    const org = await OrgController.get_org(req, res);

    res.render('org-update', {
        org: org
    })
})

routes.get('/org/dashboard', authMiddleware, async (req, res) => {
    const org_result = await OrgController.get_org(req, res);
    const cases_result = await CaseController.get_cases_from_org(req, res);

    res.render('org-dashboard', {
        org: org_result,
        cases: cases_result
    });
})

routes.get('/org/case', authMiddleware, (req, res) => {
    res.render('create-case');
});

routes.get('/logs', authMiddleware, async (req, res) => {
    const org = await OrgController.get_org(req, res);
    const logs = await LogController.get_logs(req, res);

    res.render('logs', {
        log: logs,
        org: org
    })
})

module.exports = routes;