import * as assert from 'assert'
import { model as bmiModel } from '../../src/js/components/BmiCalculator'
import most from 'most'

describe('bmi calculator test', () => {
  it('really calculates bmi', (done) => {
    const change$ = most.of({
      weight: 44,
      height: 173
    })
    const props$ = most.of({})
    bmiModel({ change$, props$ })
      .take(1)
      .observe(({ bmi }) => {
        assert.equal(bmi, 15, 'wrong bmi calculation')
        done()
      })
      .catch(err => done(err))
  })
})
