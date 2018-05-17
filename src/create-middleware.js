/**
 * Middleware factory to handle simple side effects
 *
 * @param {object} effects Object with [actionName => effectFnOrArrayOfEffectFns]
 * @param {*} additionalSharedData which will be sent to all effects as 4th argument
 * @returns {function} Redux middleware with some additional properties
 */
export default function createMiddleware(effects, additionalSharedData = null) {
  const setEffects = e => {
    effects = Object.assign({}, e)
  }

  function effectsMiddleware({ dispatch, getState }) {
    return next => action => {
      if (effects[action.type]) {
        // Delay to be fired after action is dispatched
        setTimeout(() => {
          [].concat(effects[action.type]).forEach(x => x(Object.assign({}, action), dispatch, getState(), additionalSharedData))
        }, 1)
      }

      next(action)
    }
  }

  effectsMiddleware.replaceEffects = setEffects

  setEffects(effects)

  return effectsMiddleware
}
