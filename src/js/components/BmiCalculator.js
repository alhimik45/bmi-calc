import most from 'most'
import { div } from '@cycle/dom'
import isolate from '@cycle/isolate'
import R from 'ramda'

export function intent ({ weight, height }) {
  const change$ = most.combine(
    (weight, height) => ({ weight, height }),
    weight,
    height
  )
  return {
    change$
  }
}

export function model ({ change$, props$ }) {
  return change$
    .map(({ weight, height }) => {
      const heightMeters = height * 0.01
      return Math.round(weight / (heightMeters * heightMeters))
    })
    .combine(
      (bmi, props) => R.merge(props, { bmi }),
      props$
    )
}

export function view (state$) {
  return state$.map(({ bmi, label }) =>
    div('.bmi-calculator-component', [
      div('.bmi-label', `${label} ${bmi}`)
    ])
  )
}

function main (sources) {
  const { change$ } = intent(sources)
  const state$ = model({
    change$,
    props$: sources.props
  })
  const vtree$ = view(state$)
  return {
    DOM: vtree$,
    value: state$.map(R.prop('value'))
  }
}

export default function BmiCalculator (sources) {
  return isolate(main)(sources)
}
