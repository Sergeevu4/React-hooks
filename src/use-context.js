import React, { useContext } from 'react';
import ReactDOM from 'react-dom';

const MyContext = React.createContext();
const App = () => (
  <MyContext.Provider value={'Hello World 123'}>
    <Child />
  </MyContext.Provider>
);

// # Старый метод использования React Context
// const Child = () => {
//   return <MyContext.Consumer>{(value) => <p>{value}</p>}</MyContext.Consumer>;
// };

const Child = () => {
  // Передаем объект контекста, не Provider или Consumer
  const value = useContext(MyContext);
  return <p>{value}</p>;
};

ReactDOM.render(<App />, document.getElementById('root'));
