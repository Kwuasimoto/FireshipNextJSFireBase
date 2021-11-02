<h2> UseState React Hook </h2>

Use state react hook is used to handle reactive data within the react element.

The useState function returns an array that contains the reactive value and its setter function.

Whenever the reactive value changes, react will update the ui to reflect the changes of the value. <br>

<h2> UseEffect React Hook </h2>

The second most important react hooks

- Component life cycle.

    - componentDidMount // init
    - componentDidUpdate // updated ? multiple
    - componentWillUnmount // done?

useEffect combines all three of these functions into one.

useEffect, without dependancy injection will run everytime stateful variables change on the component. Running once for the default, and everytime once the state changes.

the dependancy option in useEffect will only run once when the component is first initialized.

if you want to run the code within useEffect again upon every state update, the state variable must be passed through the dependancy injection.

-- Important Note: Tear down functions can be useful to run a piece of code similarily to the (ComponentWillUnmount) component lifecycle method.

<h2> UseContext React Hook </h2>

Allows us to interact with props globally in our react element.

<MoodContext.Consumer> </br>
    {({val}) => \<p>{val}\<p>} </br>
</MoodContext.Consumer>

<h2> UseRef </h2>

Creates a mutable object that maintains is reference between renders.
similar to setState, but doesn't trigger a re-render.

Its most common use is reference html elements from the dom.

<h2> useReducer </h2>

yea, it is like redux via dispatching actions.

The useReducer hook is cleaner, as we simply define our reducer functions,
then passing them to the use reducer hook which passes the state and action we will update to the function we wrote.

```javascript
function reducer(state, action) {
    switch (action.type) {
        case 'increment':
            return state + 1;
        case 'decrement': 
            return state -1;
        default:    
            throw new Error();
    }
}    

function App() {

    // initial state is second argument.
    const [state, dispatch] = useReducer(reducer, 0)

    return (
        <>
        // Button that uses
            {() => dispatch({type: 'decrement' /* type passed to reducer on action object*/ })}
        <>
    )
}


```


<h2> useMemo </h2>

helps with expensive computations, on single properties

<h2> useCallback </h2>

used for memoizing functions

useCallback prevents unnecessary rerenders of the children, by always using the same function object.

<h2> useImperativeHandle </h2>

:| 

<h2> CustomHooks </h2>

```javascript
function useDisplayName () {
    const [displayName, setDisplayName] = useState()

    useEffect(() => {
        const fetchData...
        setData...
    }, [])

    // For showing custom labels on variables in react dev tools.
    useDebugValue(displayName ?? 'loading..') 

    return displayName; // important!
}

```
