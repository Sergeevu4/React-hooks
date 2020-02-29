import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const App = () => (
  <div>
    <HooksSwitcher />
  </div>
);

/*
  # useState функция установки состояние по умолчанию
  Переданный параметр это первоначальное состояние: переменная color - куда запишется это состояние

  # setColor функция устанавливает новое значение в state

  #useState можно вызывать несколько раз и работать с нескольки независимыми частями state
  например fontSize

  # Если state завист от предыдущего state, то нужно передавать функцию
  setFontSize((s) => s - 2)

  # Разница работы между хуками и компонентами class:
    Например class находиться
      state = {
        firstName: 'Sergei',
        lastName: 'Kozlov',
        age: 15
      }

    Для того, чтобы сменит какое-нибудь значение:
    this.setState({age: 25})
    остальные значение state сохраняться,
    смениться только одно значение

    ! Но с hooks так не получится
      ! hooks всегда обновляет объект полностью, а не осуществляет слияние поля как setState()
    const [programmer, setProgrammer] = useState({
        firstName: 'Sergei',
        lastName: 'Kozlov',
        age: 15
      })

    setProgrammer({ age: 25 }) - перезапишется весь state и остальные значения пропадут
      То есть set функция не будет заменять только нужно состояния объекта, она будет
      тот объект который в нее передан

      * Способы сохранить значения
        1) Разделить state на независимые части
            const [programmerName, setProgrammerName] = useState(firstName: 'Sergei')
            const [programmerLastName, setProgrammerLastName] = useState(lastName: 'Kozlov')
            const [programmerAge, setProgrammerAge] = useState(Age: 15)

            Смена свойства
              setProgrammerAge(25)

        2) Передавать свойства и использовать функцию
            const [programmer, setProgrammer] = useState({
              firstName: 'Sergei',
              lastName: 'Kozlov',
              age: 15
            })

            Смена свойства
              setProgrammer((programmer) => {
                  return {
                    ...programmer,
                    age: 25
                  }
              })
*/

const HooksSwitcher = () => {
  const [color, setColor] = useState('white');
  const [fontSize, setFontSize] = useState(14);

  return (
    <div
      style={{
        padding: '10px',
        backgroundColor: color,
        fontSize: `${fontSize}px`,
      }}
    >
      <p style={{ color: color === 'black' ? 'white' : 'black' }}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, quam.
      </p>

      <button onClick={() => setColor('black')}>Dark</button>
      <button onClick={() => setColor('white')}>Light</button>
      <button onClick={() => setFontSize((s) => s + 2)}>+</button>
      <button onClick={() => setFontSize((s) => s - 2)}>-</button>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
