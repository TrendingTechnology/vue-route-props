import Vue from 'vue'
import VueRouter from 'vue-router'
import VueRouteProps from '../../../src/index'

Vue.use(VueRouter)
Vue.use(VueRouteProps)

let vm
let router
let spy

describe('required', () => {
  beforeEach(() => {
    router = new VueRouter({
      routes: [{
        path: '/'
      }],
    })
    spy = jest.spyOn(console, 'error').mockImplementation()
  })

  afterEach(() => {
    vm.$router.replace({
      query: {}
    })
      .catch(error => {
        // ignore navigation to same route
      })
    vm.$destroy()
    spy.mockClear()
  })

  it(`should log error when requiredProp's required option is true even default option is given.`, async () => {
    vm = new Vue({
      router,
      routeProps: {
        prop: {
          required: true,
          default: 'default'
        }
      }
    })

    expect(vm.$route.query).toEqual({})
    expect(console.error).toHaveBeenCalledTimes(1)
  })

  it(`should use default value.`, async () => {
    vm = new Vue({
      router,
      routeProps: {
        prop: {
          default: 'default'
        }
      }
    })

    expect(vm.$route.query).toEqual({})
    expect(console.error).toHaveBeenCalledTimes(0)
    expect(vm.prop).toEqual('default')
  })

  it(`should use query but default value.`, async () => {
    vm = new Vue({
      router,
      routeProps: {
        prop: {
          default: 'default'
        }
      }
    })
    spy.mockClear()
    vm.$router.replace({
      query: {
        prop: JSON.stringify('query')
      }
    })
    // waiting for watch trigger
    await Promise.resolve()

    expect(vm.$route.query).toEqual({ prop: JSON.stringify('query') })
    expect(console.error).toHaveBeenCalledTimes(0)
    expect(vm.prop).toEqual('query')
  })

  it(`should not use object type as default value.`, () => {
    vm = new Vue({
      router,
      routeProps: {
        prop: {
          default: {}
        }
      }
    })

    expect(console.error).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0].slice(0, 2)).toEqual([
      `[VueRouteProps warn]: `,
      `Invalid default value for routeProp "prop": routeProps with type Object/Array must use a factory function to return the default value.`
    ])
  })

  it(`should not use array type as default value.`, () => {
    vm = new Vue({
      router,
      routeProps: {
        prop: {
          default: []
        }
      }
    })

    expect(console.error).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0].slice(0, 2)).toEqual([
      `[VueRouteProps warn]: `,
      `Invalid default value for routeProp "prop": routeProps with type Object/Array must use a factory function to return the default value.`
    ])
  })

  it(`should get default value from given function`, () => {
    const value = {}
    vm = new Vue({
      router,
      routeProps: {
        prop: {
          default () {
            return value
          }
        }
      }
    })

    expect(vm.prop).toBe(value)
  })
})