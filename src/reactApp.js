import React from 'react'
import ReactDOM from 'react-dom'
import {FnComponent} from './reacttest'
import {Nan,fnA} from './tsDemo'

fnA(12);
const nan=new Nan()
nan.getName()

ReactDOM.render(<FnComponent></FnComponent>,document.getElementById('app'))