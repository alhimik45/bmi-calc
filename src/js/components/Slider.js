import { label, div, input } from '@cycle/dom'
import isolate from '@cycle/isolate'
import R from 'ramda'

export function intent ({ DOM }) {
  const sliderChange$ = DOM
    .select('.slider')
    .events('input')
    .map(ev => ev.target.value)
  const numberInputChange$ = DOM
    .select('.number')
    .events('input')
    .map(ev => ev.target.value)
  return {
    change$: sliderChange$.merge(numberInputChange$)
  }
}

export function model ({ change$, props$ }) {
  const initialValue$ = props$.map(R.prop('init')).take(1)
  const value$ = initialValue$.concat(change$)
  return value$.combine(
    (value, props) => R.merge(props, { value }),
    props$)
}

export function view (state$) {
  return state$.map(({ value, label: labelStr, unit, min, max }) =>
    div('.slider-component', [
      div('.slider-label', [
        label(`${labelStr}: ${value} ${unit}`)
      ]),
      div('.inputs', [
        input('.slider.range', { props: { type: 'range', min, max, value } }),
        input('.number.text-input', { props: { type: 'number', min, max, value } })
      ])
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

export default function Slider (sources) {
  return isolate(main)(sources)
}
