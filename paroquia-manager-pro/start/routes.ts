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

router.get('/', async () => {
  return { hello: 'Paróquia Manager Pro API' }
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
    router.get('/:id', [SacramentController, 'show'])
    router.post('/', [SacramentController, 'store'])
  }).prefix('sacraments')

  // CATECHISM
  router.group(() => {
    router.post('classes', [CatechismController, 'storeClass'])
    router.get('classes/:id', [CatechismController, 'show'])
    router.post('enroll', [CatechismController, 'enroll'])
    router.post('attendance', [CatechismController, 'attendance'])
    router.get('classes/:classId/members/:memberId/frequency', [CatechismController, 'frequency'])
  }).prefix('catechism')

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

  // PASTORAL EVENTS
  router.get('pastorals/:id/events', [PastoralEventsController, 'index'])
  router.post('pastorals/:id/events', [PastoralEventsController, 'store'])
  router.put('events/:id', [PastoralEventsController, 'update'])
  router.delete('events/:id', [PastoralEventsController, 'destroy'])

  // ANNOUNCEMENTS (AVISOS)
  router.post('pastorals/:id/announcements', [PastoralNoticesController, 'sendToPastoral'])
  router.post('announcements/all', [PastoralNoticesController, 'sendToAll'])

  // NOTIFICATIONS
  router.group(() => {
    router.get('/', [NotificationController, 'index'])
    router.get('unread-count', [NotificationController, 'unreadCount'])
    router.put('/:id/read', [NotificationController, 'markAsRead'])
  }).prefix('notifications')

  // USERS (Admin only)
  router.group(() => {
    router.get('/', [UsersController, 'index'])
    router.get('/:id', [UsersController, 'show'])
    router.put('/:id', [UsersController, 'update'])
    router.delete('/:id', [UsersController, 'destroy'])
  }).prefix('users').use(middleware.rbac({ roles: ['ADMIN'] }))

}).use(middleware.auth())