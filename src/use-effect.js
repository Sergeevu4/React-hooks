import React, { useState, useEffect, Component } from 'react';
import ReactDOM from 'react-dom';

/*
  ! Можно вызывать useState и useEffect много раз в одном компоненте, и они будут полностью независимы.

  # useEffect() - регистрирует функцию у которой могут быть побочные эффекты
      * Объединяет в себе два метода жизненного цикла:
        * componentDidMount и componentDidUpdate

        - Функция сработает сразу когда компонент появиться на странице
            Можно создавать timeout или отправлять запрос на сервер
              жизненный цикл: componentDidMount

        - Функция будет срабатывать каждый раз как компонент обновиться (props)
            жизненный цикл: componentDidUpdate

      * Для того чтобы обновлять компонент, только тогда когда обновились определенные свойства:
        - class:
          componentDidUpdate(prevProps) {
            if (prevProps.value !== this.props.value) {...}
          }

        - hooks:
            необходимо передать вторым аргументом массив тех данных
            которые будем проверять, для того чтобы решить следует ли
            вызывать этот хук или нет.
              useEffect(() => {...}, [value])

          ! При этом сравнивать значения как componentDidUpdate, не нужно
            этот функционал уже реализован в хуке

          ! Если вторым аргументом передать пустой массив, то функция сработает только один раз
            как componentDidMount

          ! Если не передавать вторым аргументом массив, то код внутри useEffect
            вызываться каждый раз, когда компонент обновляется, при любых изменениях состояния

      * Для того, чтобы очищать эффекты которые производим внутри функции useEffect
          Например снимать таймеры
          Аналог метода жизненого цикла componentWillUnmount
            Для запуска необходимо вернуть функцию
                useEffect(() => {
                    console.log('mount') - когда компонент создается
                    return () => console.log('unmount'); - когда компонент уничтожается
              }, []);

        ! Но в отличие от componentWillUnmount, функция будет запускать
          не только когда компонент пропадает, но и тогда когда нужно запустить
          следующий эффект, то есть очистка предыдущего и запись нового значения
            При увеличении, уменьшении счетчика будет вызываться тоже функция
               return () => console.log('unmount');

    # componentDidMount + componentWillUnmount
      useEffect(() => {
          console.log('mount') - когда компонент создается
          return () => console.log('unmount'); - когда компонент уничтожается
      }, []); - Вызовется один раз

    # componentDidUpdate (НО будет вызван при mount компонента)
      useEffect(() => {
          console.log('update');
      });

    # Стандартный метод отмены Fetch запроса - AbortController
        useEffect(() => {
          const controller = new AbortController();
          fetch(`https://swapi.co/api/planets/${id}`, {
            signal: controller.signal,
          })
          ...
          return () => controller.abort();
        }, [id])

        ! Техника собственного прерывания будет работать, не только с fetch и с другими промисами

    # Собственные Hooks, любые функции начинающиеся с use.
        Можно использующие стандартные hooks + другие собственные.
        Можно выносить переиспользуемую Логику. Аналог компонентов высшего порядка HOC()
  */

const App = () => {
  // Счетчик
  const [value, setValue] = useState(1); // Первоначальное состояние
  // Следует ли отображаться счетчики
  const [visible, setVisible] = useState(true);

  if (visible) {
    return (
      <div>
        <Notification />

        <button onClick={() => setValue((v) => v - 1)}>-</button>
        <button onClick={() => setValue((v) => v + 1)}>+</button>
        <button onClick={() => setVisible(false)}>hide</button>

        <HookCounter value={value} />

        <PlanetInfo id={value} />
      </div>
    );
  } else {
    return <button onClick={() => setVisible(true)}>show</button>;
  }
};

// # Показ id
const HookCounter = ({ value }) => {
  useEffect(() => {
    console.log('mount');

    return () => console.log('unmount');
  }, []);

  useEffect(() => {
    console.log('update');
  });

  return <p>id: {value}</p>;
};

// # Пропадающее сообщение
const Notification = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(false), 2500);
    // ! Обязательно снимать таймер
    return () => clearTimeout(timeout);
  }, []);

  return visible && <p>Hello</p>;
};

// # Собственный Hook
const usePlanetInfo = (id) => {
  const [name, setName] = useState(null);

  useEffect(() => {
    // ! Собственный проигнорировать результат Fetch или Promise
    //  При сокрытии, и загрузки данных будет ошибка, если не отменять Fetch
    let cancelled = false;

    fetch(`https://swapi.co/api/planets/${id}`)
      .then((res) => res.json())
      // cancelled - false, тогда будет вызов fetch
      .then((data) => !cancelled && setName(data.name))
      .catch((err) => console.error(err));

    return () => (cancelled = true);
  }, [id]);

  // Возвращаю переменную состояния (имя планеты)
  return name;
};

// # Асинхронная загрузка данных
const PlanetInfo = ({ id }) => {
  const name = usePlanetInfo(id);

  return <div>Planet Name: {name}</div>;
};

class ClassCounter extends Component {
  componentDidMount() {
    console.log('class: mount');
  }

  componentDidUpdate() {
    console.log('class: update');
  }

  componentWillUnmount() {
    console.log('class: unmount');
  }

  render() {
    return <p>{this.props.value}</p>;
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
