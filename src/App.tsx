
import './App.css';
import React from 'react';
import $ from 'jquery';


export interface IPropsk {
  data?: Array<string>;
  fetchData?(value: string): void;
}

export interface IState {
  count:number
}

export type counter = {
  count:number
}

interface Counter {
  addCount():Promise<void>;
  subCount():Promise<void>;
  resetCount():Promise<void>;
  latestCount():Promise<void>;
  keydown(event: KeyboardEvent):Promise<void>;
}

class Counter extends React.Component<IPropsk, IState> implements Counter {
  state:IState = {
    count:0,
  }
  constructor(props:IPropsk){
    super(props)
  }

  addCount = async() => {
    // console.log('add')
     const counter:counter = await $.get('api/counter/add')
     await this.setState({count:counter.count})
  }

  subCount = async() => {
    // console.log('sub')
   const counter:counter = await $.get('api/counter/sub')
   await this.setState({count:counter.count})
  }

  resetCount = async() => {
    // console.log('reset')
   const counter:counter = await $.get('api/counter/reset')
   await this.setState({count:counter.count})
  }

  latestCount = async () =>{
    const counter:counter = await $.get('api/counter/latest')    
    // console.log(counter)
    this.setState({count:counter.count})
  }

  async keyDownHandler (event: KeyboardEvent){    
       
    switch (event.key) {      
      case 'ArrowUp':
        await this.addCount()
        break;
      case 'ArrowDown':
        await this.subCount()
        break;
      default:
        break;
    }
  }

  componentDidMount(){
    $('#reset').click(this.resetCount)
    $('#increment').click(this.addCount)
    $('#decrement').click(this.subCount)
    //javascript raw is so much powerful :) i love u.
    document.addEventListener('keydown',(e:KeyboardEvent)=>{
      this.keyDownHandler(e)
    })
    this.latestCount()
    
  }
  
  render(){
    return(
      <>
        <div className="countercontent">
          <div className="center">
            <div id="value"><h1>{this.state.count}</h1></div>
            <div className="counterbtns">
              <button id="reset">reset</button>
              <button id="decrement">-</button>
              <button id="increment">+</button>
            </div>
          </div>
        </div>
      </>
    )
  }

}




export default Counter;
