import React from 'react'
import { Pin } from '../types/pinData'

function PinItem({ pin }: { pin: Pin }) {
  return (
    <main>
        <div>{pin.title}</div>
        <div>{pin.address}</div>
        <div>{pin.category}</div>
        <div>{pin?.description}</div>
    </main>
  )
}

export default PinItem;