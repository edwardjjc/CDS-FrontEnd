import Vue from 'vue'
import Router from 'vue-router'

// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views
const Dashboard = () => import('@/views/Dashboard')

// Modules
const Camiones = () => import('@/views/modules/camiones/camiones')
const CamionesDetail = () => import('@/views/modules/camiones/camion-detail')
const Configuraciones = () => import('@/views/modules/configuraciones/configuraciones')
const Companias = () => import('@/views/modules/companias/companias')
const CompaniaDetail = () => import('@/views/modules/companias/compania-detail')
const Contenedores = () => import('@/views/modules/contenedores/contenedores')
const ContenedoresDetail = () => import('@/views/modules/contenedores/contenedor-detail')
const TiposContenedores = () => import('@/views/modules/tipos-contenedores/tipos-contenedores')
const TiposContenedoresDetail = () => import('@/views/modules/tipos-contenedores/tipos-contenedores-detail')
const Dispositivos = () => import('@/views/modules/dispositivos-iot/dispositivos-iot')
const DispositivosDetail = () => import('@/views/modules/dispositivos-iot/dispositivos-iot-detail')
const Usuarios = () => import('@/views/modules/usuarios/usuarios')
const UsuariosDetail = () => import('@/views/modules/usuarios/usuario-detail')
const Rutas = () => import('@/views/modules/rutas/ruta')
const Historial = () => import('@/views/modules/rutas/historial')

//const Rutas = () => import('@/views/theme/Rutas')
//const Historial = () => import('@/views/theme/Historial')
//const Camiones = () => import('@/views/theme/Camiones')
/* const Colors = () => import('@/views/theme/Colors') */

/* const Charts = () => import('@/views/charts/Charts')
const Widgets = () => import('@/views/widgets/Widgets') */

/* // Views - Components
const Cards = () => import('@/views/base/Cards')
const Forms = () => import('@/views/base/Forms')
const Switches = () => import('@/views/base/Switches')
const Tables = () => import('@/views/base/Tables')
const Tabs = () => import('@/views/base/Tabs')
const Breadcrumbs = () => import('@/views/base/Breadcrumbs')
const Carousels = () => import('@/views/base/Carousels')
const Collapses = () => import('@/views/base/Collapses')
const Jumbotrons = () => import('@/views/base/Jumbotrons')
const ListGroups = () => import('@/views/base/ListGroups')
const Navs = () => import('@/views/base/Navs')
const Navbars = () => import('@/views/base/Navbars')
const Paginations = () => import('@/views/base/Paginations')
const Popovers = () => import('@/views/base/Popovers')
const ProgressBars = () => import('@/views/base/ProgressBars')
const Tooltips = () => import('@/views/base/Tooltips') */


/* // Views - Buttons
const StandardButtons = () => import('@/views/buttons/StandardButtons')
const ButtonGroups = () => import('@/views/buttons/ButtonGroups')
const Dropdowns = () => import('@/views/buttons/Dropdowns')
const BrandButtons = () => import('@/views/buttons/BrandButtons') */

/* // Views - Icons
const CoreUIIcons = () => import('@/views/icons/CoreUIIcons')
const Brands = () => import('@/views/icons/Brands')
const Flags = () => import('@/views/icons/Flags') */

// Views - Notifications
/* const Alerts = () => import('@/views/notifications/Alerts')
const Badges = () => import('@/views/notifications/Badges')
const Modals = () => import('@/views/notifications/Modals') */

// Views - Pages
/* const Page404 = () => import('@/views/pages/Page404')
const Page500 = () => import('@/views/pages/Page500') */
const Login = () => import('@/views/pages/Login')
const Register = () => import('@/views/pages/Register')

// Users
const Users = () => import('@/views/users/Users')
const User = () => import('@/views/users/User')

Vue.use(Router)

export default new Router({
  mode: 'hash', 
  linkActiveClass: 'active',
  scrollBehavior: () => ({ y: 0 }),
  routes: configRoutes()
})

function configRoutes () {
  return [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      component: TheContainer,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'rutas',
          name: 'Rutas',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'rutas',
              name: 'Ruta',
              component: Rutas
            },
            {
              path: 'historial',
              name: 'Historial',
              component: Historial
            }
          ]
        },
        {
          path: 'mantenimientos',
          name: 'Mantenimientos',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'camiones',
              name: 'Camiones',
              component: Camiones
            },
            {
              path: 'camiones-detail/:id',
              name: 'Camion',
              component: CamionesDetail
            },
            {
              path: 'companias',
              name: 'Companias',
              component: Companias
            },
            {
              path: 'companias-detail/:id',
              name: 'Compania',
              component: CompaniaDetail
            },
            {
              path: 'contenedores',
              name: 'Contenedores',
              component: Contenedores
            },
            {
              path: 'contenedores-detail/:id',
              name: 'Contenedor',
              component: ContenedoresDetail
            },
            {
              path: 'tipos-contenedores',
              name: 'TiposContenedores',
              component: TiposContenedores
            },
            {
              path: 'tipos-contenedores-detail/:id',
              name: 'TiposContenedoresDetail',
              component: TiposContenedoresDetail
            },
            {
              path: 'dispositivos-iot',
              name: 'Dispositivos',
              component: Dispositivos
            },
            {
              path: 'dispositivos-iot-detail/:id',
              name: 'Dispositivo',
              component: DispositivosDetail
            }
          ]
        },
        {
          path: 'seguridad',
          name: 'Seguridad',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'usuarios',
              name: 'Usuarios',
              component: Usuarios
            },
            {
              path: 'usuarios-detail/:id',
              name: 'Usuario',
              component: UsuariosDetail
            },
            {
              path: 'configuraciones',
              name: 'Configuraciones',
              component: Configuraciones
            },
          ]
        },
/*         {
          path: 'charts',
          name: 'Charts',
          component: Charts
        },
        {
          path: 'widgets',
          name: 'Widgets',
          component: Widgets
        },
        {
          path: 'base',
          redirect: '/base/cards',
          name: 'Base',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'cards',
              name: 'Cards',
              component: Cards
            },
            {
              path: 'forms',
              name: 'Forms',
              component: Forms
            },
            {
              path: 'switches',
              name: 'Switches',
              component: Switches
            },
            {
              path: 'tables',
              name: 'Tables',
              component: Tables
            },
            {
              path: 'tabs',
              name: 'Tabs',
              component: Tabs
            },
            {
              path: 'breadcrumbs',
              name: 'Breadcrumbs',
              component: Breadcrumbs
            },
            {
              path: 'carousels',
              name: 'Carousels',
              component: Carousels
            },
            {
              path: 'collapses',
              name: 'Collapses',
              component: Collapses
            },
            {
              path: 'jumbotrons',
              name: 'Jumbotrons',
              component: Jumbotrons
            },
            {
              path: 'list-groups',
              name: 'List Groups',
              component: ListGroups
            },
            {
              path: 'navs',
              name: 'Navs',
              component: Navs
            },
            {
              path: 'navbars',
              name: 'Navbars',
              component: Navbars
            },
            {
              path: 'paginations',
              name: 'Paginations',
              component: Paginations
            },
            {
              path: 'popovers',
              name: 'Popovers',
              component: Popovers
            },
            {
              path: 'progress-bars',
              name: 'Progress Bars',
              component: ProgressBars
            },
            {
              path: 'tooltips',
              name: 'Tooltips',
              component: Tooltips
            }
          ]
        }, */
/*         {
          path: 'buttons',
          redirect: '/buttons/standard-buttons',
          name: 'Buttons',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'standard-buttons',
              name: 'Standard Buttons',
              component: StandardButtons
            },
            {
              path: 'button-groups',
              name: 'Button Groups',
              component: ButtonGroups
            },
            {
              path: 'dropdowns',
              name: 'Dropdowns',
              component: Dropdowns
            },
            {
              path: 'brand-buttons',
              name: 'Brand Buttons',
              component: BrandButtons
            }
          ]
        }, */
/*         {
          path: 'icons',
          redirect: '/icons/coreui-icons',
          name: 'CoreUI Icons',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'coreui-icons',
              name: 'Icons library',
              component: CoreUIIcons
            },
            {
              path: 'brands',
              name: 'Brands',
              component: Brands
            },
            {
              path: 'flags',
              name: 'Flags',
              component: Flags
            }
          ]
        }, */
/*         {
          path: 'notifications',
          redirect: '/notifications/alerts',
          name: 'Notifications',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'alerts',
              name: 'Alerts',
              component: Alerts
            },
            {
              path: 'badges',
              name: 'Badges',
              component: Badges
            },
            {
              path: 'modals',
              name: 'Modals',
              component: Modals
            }
          ]
        } */
      ]
    },
    {
      path: '/pages',
      redirect: '/pages/404',
      name: 'Pages',
      component: {
        render (c) { return c('router-view') }
      },
      children: [
/*         {
          path: '404',
          name: 'Page404',
          component: Page404
        }, */
/*         {
          path: '500',
          name: 'Page500',
          component: Page500
        }, */
        {
          path: 'login',
          name: 'Login',
          component: Login
        },
        {
          path: 'register',
          name: 'Register',
          component: Register
        }
      ]
    }
  ]
}

