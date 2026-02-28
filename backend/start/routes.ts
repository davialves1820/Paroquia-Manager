import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')
const MemberController = () => import('#controllers/member_controller')
const DonationController = () => import('#controllers/donation_controller')
const SacramentController = () => import('#controllers/sacrament_controller')
const CatechismController = () => import('#controllers/catechism_controller')
const DashboardController = () => import('#controllers/dashboard_controller')
const ReportController = () => import('#controllers/report_controller')
const NotificationController = () => import('#controllers/notification_controller')
const UsersController = () => import('#controllers/users_controller')
const PastoralsController = () => import('#controllers/pastorals_controller')
const PastoralEventsController = () => import('#controllers/pastoral_events_controller')
const PastoralNoticesController = () => import('#controllers/pastoral_notices_controller')
import AutoSwagger from 'adonis-autoswagger'
import swaggerConfig from '#config/swagger'

router.get('/', async () => {
  return { hello: 'Paróquia Manager Pro API' }
})

// returns swagger-ui html
router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger.json', swaggerConfig)
})

// returns swagger spec json
router.get('/swagger.json', async () => {
  return AutoSwagger.default.json(router.toJSON(), swaggerConfig)
})

// AUTH ROUTES
router.group(() => {
  router.post('register', [UsersController, 'store'])
  router.post('login', [AuthController, 'login'])
  router.post('logout', [AuthController, 'logout']).use(middleware.auth())
  router.get('me', [AuthController, 'me']).use(middleware.auth())
}).prefix('auth')

// PROTECTED ROUTES
router.group(() => {

  // DASHBOARD
  router.get('dashboard', [DashboardController, 'index'])

  // MEMBERS
  router.group(() => {
    router.get('/', [MemberController, 'index'])
    router.get('/:id', [MemberController, 'show'])
    router.post('/', [MemberController, 'store'])
    router.put('/:id', [MemberController, 'update'])
    router.delete('/:id', [MemberController, 'destroy']).use(middleware.rbac({ roles: ['ADMIN'] }))
  }).prefix('members')

  // DONATIONS
  router.group(() => {
    router.get('/', [DonationController, 'index'])
    router.post('/', [DonationController, 'store'])
  }).prefix('donations')

  // SACRAMENTS
  router.group(() => {
    router.get('/', [SacramentController, 'index'])
    router.get('/agenda/:priestId?', [SacramentController, 'agenda'])
    router.get('/:id', [SacramentController, 'show'])
    router.post('/', [SacramentController, 'store']).use(middleware.rbac({ roles: ['ADMIN', 'PADRE'] }))
    router.put('/:id', [SacramentController, 'update']).use(middleware.rbac({ roles: ['ADMIN', 'PADRE'] }))
    router.delete('/:id', [SacramentController, 'destroy']).use(middleware.rbac({ roles: ['ADMIN', 'PADRE'] }))
  }).prefix('sacraments')

  // CATECHISM
  router.group(() => {
    router.get('/', [CatechismController, 'index'])
    router.post('classes', [CatechismController, 'storeClass'])
    router.get('classes/:id', [CatechismController, 'show'])
    router.post('students', [CatechismController, 'addStudent'])
    router.put('students/:id', [CatechismController, 'updateStudent'])
    router.delete('students/:studentId', [CatechismController, 'removeStudent'])
    router.post('attendance', [CatechismController, 'attendance'])
    router.get('classes/:classId/students/:studentId/frequency', [CatechismController, 'frequency'])
    router.get('metrics', [CatechismController, 'metrics'])
    router.get('missing-sacraments', [CatechismController, 'missingSacraments'])
    router.post('meetings', [CatechismController, 'toggleMeeting'])
    router.get('meetings/status', [CatechismController, 'meetingStatus'])
  }).prefix('catechism').use(middleware.rbac({ roles: ['ADMIN', 'CATEQUISTA'] }))

  // REPORTS
  router.group(() => {
    router.get('members', [ReportController, 'members'])
    router.get('donations', [ReportController, 'donations'])
    router.get('sacraments', [ReportController, 'sacraments'])
  }).prefix('reports')

  // PASTORAIS
  router.resource('pastorals', PastoralsController).apiOnly()
  router.post('pastorals/:id/members', [PastoralsController, 'addMember'])
  router.delete('pastorals/:id/members', [PastoralsController, 'removeMember'])
  router.post('pastorals/:id/coordinators', [PastoralsController, 'addCoordinator'])
  router.delete('pastorals/:id/coordinators', [PastoralsController, 'removeCoordinator'])
  router.post('pastorals/:id/invite-user', [PastoralsController, 'inviteUser'])

  // PASTORAL EVENTS
  router.get('pastorals/:id/events', [PastoralEventsController, 'index'])
  router.post('pastorals/:id/events', [PastoralEventsController, 'store'])
  router.put('events/:id', [PastoralEventsController, 'update'])
  router.delete('events/:id', [PastoralEventsController, 'destroy'])
  router.post('events/:eventId/attendance', [PastoralEventsController, 'attendance'])

  // ANNOUNCEMENTS (AVISOS)
  router.post('pastorals/:id/announcements', [PastoralNoticesController, 'sendToPastoral'])
  router.post('announcements/all', [PastoralNoticesController, 'sendToAll'])

  // NOTIFICATIONS
  router.group(() => {
    router.get('/', [NotificationController, 'index'])
    router.get('unread-count', [NotificationController, 'unreadCount'])
    router.put('/:id/read', [NotificationController, 'markAsRead'])
  }).prefix('notifications')

  // USERS (Admin and Priest)
  router.group(() => {
    router.get('/', [UsersController, 'index'])
    router.get('/:id', [UsersController, 'show'])
    router.put('/:id', [UsersController, 'update'])
    router.delete('/:id', [UsersController, 'destroy'])
  }).prefix('users').use(middleware.rbac({ roles: ['ADMIN', 'PADRE'] }))

}).use(middleware.auth())