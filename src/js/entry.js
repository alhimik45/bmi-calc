import most from 'most'
import Cycle from '@cycle/most-run'
import { makeDOMDriver, p, div, h1 } from '@cycle/dom'
import Slider from './components/Slider'
import BmiCalculator from './components/BmiCalculator'

function main ({ DOM }) {
  const weightSlider = Slider({
    DOM,
    props: most.of({
      init: 65,
      min: 30,
      max: 150,
      label: 'Weight',
      unit: 'kg'
    })
  })
  const HeightSlider = Slider({
    DOM,
    props: most.of({
      init: 170,
      min: 140,
      max: 220,
      label: 'Height',
      unit: 'cm'
    })
  })
  const calculator = BmiCalculator({
    weight: weightSlider.value,
    height: HeightSlider.value,
    props: most.of({
      label: 'Bmi is'
    })
  })

  return {
    DOM: most.combineArray((weightVTree, heightVTree, calculatorVTree) => div([
      h1('BMI calculator'),
      p([ weightVTree ]),
      p([ heightVTree ]),
      p([ calculatorVTree ])
    ]), [ weightSlider.DOM, HeightSlider.DOM, calculator.DOM ])
  }
}

const drivers = {
  DOM: makeDOMDriver('#app')
}

Cycle.run(main, drivers)
