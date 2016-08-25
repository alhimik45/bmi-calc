import * as assert from 'assert'
import { model as sliderModel } from '../../src/js/components/Slider'
import most from 'most'

describe('slider test', () => {
  it('returns initial value as first', (done) => {
    const change$ = most.of(666)
    const props$ = most.of({
      init: 42
    })
    sliderModel({ change$, props$ })
      .take(1)
      .observe(({ value }) => {
        assert.equal(value, 42, 'wrong initial value')
        done()
      })
      .catch(err => done(err))
  })

  it('returns emitted value after initial value', (done) => {
    const change$ = most.of(666)
    const props$ = most.of({
      init: 42
    })
    sliderModel({ change$, props$ })
      .skip(1)
      .take(1)
      .observe(({ value }) => {
        assert.equal(value, 666, 'wrong first value')
        done()
      })
      .catch(err => done(err))
  })
})
