import jwt_decode from 'jwt-decode';

let jwtData = jwt_decode(localStorage.access_token);

export default [
  {
    _name: 'CSidebarNav',
    _children: [
      {
        _name: 'CSidebarNavItem',
        name: 'Dashboard',
        to: '/dashboard',
        icon: 'cil-speedometer'
      },
      {
        _name: 'CSidebarNavDropdown',
        name: 'Rutas',
        route: '/',
        icon: 'cil-terrain',
        items: [
          {
            _name: 'CSidebarNavItem',
            name: 'Ruta',
            color: "dark",
            to: '/rutas/rutas',
            icon: 'cil-map'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Ver Historial',
            color: "dark",
            to: '/rutas/historial',
            icon: 'cil-history'
          }
        ]
      },
      {
        _name: 'CSidebarNavDropdown',
        name: 'Mantenimientos',
        route: '/',
        icon: 'cil-list',
        items: [
          {
            _name: 'CSidebarNavItem',
            name: 'Camiones',
            color: "dark",
            to: '/mantenimientos/camiones',
            icon: 'cil-truck'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Compañias',
            color: "dark",
            to: '/mantenimientos/companias',
            icon: 'cil-building'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Contenedores',
            color: "dark",
            to: '/mantenimientos/contenedores',
            icon: 'cil-trash'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'DispositivosIoT',
            color: "dark",
            to: '/mantenimientos/dispositivos-iot',
            icon: 'cil-devices'
          }
        ]
      },
      {
        _name: 'CSidebarNavDropdown',
        name: 'Seguridad',
        route: '/',
        icon: 'cil-lock-locked',
        items: [
          {
            name: 'Usuarios',
            to: '/seguridad/usuarios',
            color: "dark",
            icon: 'cil-user'
          },
          {
            name: 'Configuraciones',
            to: '/seguridad/configuraciones',
            color: "dark",
            icon: 'cil-settings'
          }
        ]
      }
    ]
  }
]